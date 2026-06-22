const crypto = require('crypto');
const path = require('path');

const { supabase } = require('./supabase');

const PROJECT_IMAGE_BUCKET = 'project-images';
const CERTIFICATE_IMAGE_BUCKET = 'certificate-images';

function sanitizeFileName(fileName) {
  const baseName = path.basename(String(fileName || 'image'));
  return baseName.replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'image';
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'project';
}

function getStorageObjectPathFromUrl(imageUrl, bucketName) {
  if (typeof imageUrl !== 'string' || !imageUrl) return null;

  try {
    const url = new URL(imageUrl);
    const marker = `/storage/v1/object/public/${bucketName}/`;
    const markerIndex = url.pathname.indexOf(marker);
    if (markerIndex === -1) return null;
    return decodeURIComponent(url.pathname.slice(markerIndex + marker.length));
  } catch {
    return null;
  }
}

function getProjectImageObjectPathFromUrl(imageUrl) {
  return getStorageObjectPathFromUrl(imageUrl, PROJECT_IMAGE_BUCKET);
}

function getCertificateImageObjectPathFromUrl(imageUrl) {
  return getStorageObjectPathFromUrl(imageUrl, CERTIFICATE_IMAGE_BUCKET);
}

function isStorageImageUrl(imageUrl, bucketName) {
  return Boolean(getStorageObjectPathFromUrl(imageUrl, bucketName));
}

function isProjectImageUrl(imageUrl) {
  return isStorageImageUrl(imageUrl, PROJECT_IMAGE_BUCKET);
}

function isCertificateImageUrl(imageUrl) {
  return isStorageImageUrl(imageUrl, CERTIFICATE_IMAGE_BUCKET);
}

async function ensureImageBucket(bucketName) {
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) {
    throw listError;
  }

  const existing = (buckets || []).find((bucket) => bucket.name === bucketName);

  if (!existing) {
    const { error: createError } = await supabase.storage.createBucket(bucketName, {
      public: true,
    });
    if (createError) {
      throw createError;
    }
    return;
  }

  if (!existing.public) {
    const { error: updateError } = await supabase.storage.updateBucket(bucketName, {
      public: true,
    });
    if (updateError) {
      throw updateError;
    }
  }
}

function buildStorageObjectPath({ folder, fileName, entityId, entityTitle }) {
  const extension = path.extname(String(fileName || '')).toLowerCase() || '.png';
  const idSegment = entityId ? `${folder.slice(0, -1)}-${entityId}` : crypto.randomUUID();
  const titleSegment = slugify(entityTitle);
  return `${folder}/${idSegment}-${titleSegment}-${Date.now()}${extension}`;
}

async function uploadProjectImage({ bytes, contentType, fileName, projectId, projectTitle }) {
  await ensureImageBucket(PROJECT_IMAGE_BUCKET);

  const objectPath = buildStorageObjectPath({
    folder: 'projects',
    fileName,
    entityId: projectId,
    entityTitle: projectTitle,
  });
  const { error: uploadError } = await supabase.storage.from(PROJECT_IMAGE_BUCKET).upload(objectPath, bytes, {
    contentType,
    upsert: true,
  });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage.from(PROJECT_IMAGE_BUCKET).getPublicUrl(objectPath);
  return {
    objectPath,
    publicUrl: data.publicUrl,
  };
}

async function deleteProjectImage(imageUrl) {
  const objectPath = getProjectImageObjectPathFromUrl(imageUrl);
  if (!objectPath) {
    return { deleted: false, objectPath: null };
  }

  await ensureImageBucket(PROJECT_IMAGE_BUCKET);
  const { error } = await supabase.storage.from(PROJECT_IMAGE_BUCKET).remove([objectPath]);
  if (error) {
    throw error;
  }

  return { deleted: true, objectPath };
}

async function uploadCertificateImage({ bytes, contentType, fileName, certificateId, certificateTitle }) {
  await ensureImageBucket(CERTIFICATE_IMAGE_BUCKET);

  const objectPath = buildStorageObjectPath({
    folder: 'certificates',
    fileName,
    entityId: certificateId,
    entityTitle: certificateTitle,
  });
  const { error: uploadError } = await supabase.storage.from(CERTIFICATE_IMAGE_BUCKET).upload(objectPath, bytes, {
    contentType,
    upsert: true,
  });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage.from(CERTIFICATE_IMAGE_BUCKET).getPublicUrl(objectPath);
  return {
    objectPath,
    publicUrl: data.publicUrl,
  };
}

async function deleteCertificateImage(imageUrl) {
  const objectPath = getCertificateImageObjectPathFromUrl(imageUrl);
  if (!objectPath) {
    return { deleted: false, objectPath: null };
  }

  await ensureImageBucket(CERTIFICATE_IMAGE_BUCKET);
  const { error } = await supabase.storage.from(CERTIFICATE_IMAGE_BUCKET).remove([objectPath]);
  if (error) {
    throw error;
  }

  return { deleted: true, objectPath };
}

module.exports = {
  CERTIFICATE_IMAGE_BUCKET,
  PROJECT_IMAGE_BUCKET,
  buildStorageObjectPath,
  deleteCertificateImage,
  deleteProjectImage,
  ensureImageBucket,
  getCertificateImageObjectPathFromUrl,
  getProjectImageObjectPathFromUrl,
  getStorageObjectPathFromUrl,
  isCertificateImageUrl,
  isProjectImageUrl,
  isStorageImageUrl,
  sanitizeFileName,
  slugify,
  uploadCertificateImage,
  uploadProjectImage,
};
