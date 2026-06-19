const crypto = require('crypto');
const path = require('path');

const { supabase } = require('./supabase');

const PROJECT_IMAGE_BUCKET = 'project-images';

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

function getProjectImageObjectPathFromUrl(imageUrl) {
  if (typeof imageUrl !== 'string' || !imageUrl) return null;

  try {
    const url = new URL(imageUrl);
    const marker = `/storage/v1/object/public/${PROJECT_IMAGE_BUCKET}/`;
    const markerIndex = url.pathname.indexOf(marker);
    if (markerIndex === -1) return null;
    return decodeURIComponent(url.pathname.slice(markerIndex + marker.length));
  } catch {
    return null;
  }
}

function isProjectImageUrl(imageUrl) {
  return Boolean(getProjectImageObjectPathFromUrl(imageUrl));
}

async function ensureProjectImageBucket() {
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) {
    throw listError;
  }

  const existing = (buckets || []).find((bucket) => bucket.name === PROJECT_IMAGE_BUCKET);

  if (!existing) {
    const { error: createError } = await supabase.storage.createBucket(PROJECT_IMAGE_BUCKET, {
      public: true,
    });
    if (createError) {
      throw createError;
    }
    return;
  }

  if (!existing.public) {
    const { error: updateError } = await supabase.storage.updateBucket(PROJECT_IMAGE_BUCKET, {
      public: true,
    });
    if (updateError) {
      throw updateError;
    }
  }
}

function buildProjectImageObjectPath({ fileName, projectId, projectTitle }) {
  const extension = path.extname(String(fileName || '')).toLowerCase() || '.png';
  const idSegment = projectId ? `project-${projectId}` : crypto.randomUUID();
  const titleSegment = slugify(projectTitle);
  return `projects/${idSegment}-${titleSegment}-${Date.now()}${extension}`;
}

async function uploadProjectImage({ bytes, contentType, fileName, projectId, projectTitle }) {
  await ensureProjectImageBucket();

  const objectPath = buildProjectImageObjectPath({ fileName, projectId, projectTitle });
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

  await ensureProjectImageBucket();
  const { error } = await supabase.storage.from(PROJECT_IMAGE_BUCKET).remove([objectPath]);
  if (error) {
    throw error;
  }

  return { deleted: true, objectPath };
}

module.exports = {
  PROJECT_IMAGE_BUCKET,
  buildProjectImageObjectPath,
  deleteProjectImage,
  ensureProjectImageBucket,
  getProjectImageObjectPathFromUrl,
  isProjectImageUrl,
  sanitizeFileName,
  slugify,
  uploadProjectImage,
};
