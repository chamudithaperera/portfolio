require('dotenv').config();

const fs = require('fs/promises');
const path = require('path');

const config = require('../server/config');
const { supabase } = require('../server/supabase');
const { TABLES } = require('../server/portfolioStore');
const { ensureProjectImageBucket, uploadProjectImage } = require('../server/storage');

function isRemoteUrl(value) {
  return typeof value === 'string' && /^https?:\/\//i.test(value);
}

async function readProjectImageBytes(imagePath) {
  const absolutePath = path.join(process.cwd(), 'public', imagePath.replace(/^\//, ''));
  const bytes = await fs.readFile(absolutePath);
  return {
    bytes,
    absolutePath,
    contentType: imagePath.endsWith('.png')
      ? 'image/png'
      : imagePath.endsWith('.webp')
        ? 'image/webp'
        : imagePath.endsWith('.jpg') || imagePath.endsWith('.jpeg')
          ? 'image/jpeg'
          : 'application/octet-stream',
  };
}

async function main() {
  if (!config.supabaseUrl) {
    throw new Error('SUPABASE_URL is missing and could not be derived.');
  }

  await ensureProjectImageBucket();

  const { data: projects, error } = await supabase
    .from(TABLES.projects)
    .select('id, title, image')
    .order('display_order', { ascending: true })
    .order('id', { ascending: true });

  if (error) {
    throw error;
  }

  for (const project of projects || []) {
    if (isRemoteUrl(project.image) && project.image.includes('/storage/v1/object/public/')) {
      console.log(`Skipping ${project.title} (already stored in Supabase Storage).`);
      continue;
    }

    if (!project.image || !String(project.image).startsWith('/assets/')) {
      console.log(`Skipping ${project.title} (unsupported image path: ${project.image || 'empty'}).`);
      continue;
    }

    const { bytes, contentType } = await readProjectImageBytes(project.image);
    const { publicUrl } = await uploadProjectImage({
      bytes,
      contentType,
      fileName: path.basename(project.image),
      projectId: project.id,
      projectTitle: project.title,
    });

    const { error: updateError } = await supabase
      .from(TABLES.projects)
      .update({ image: publicUrl })
      .eq('id', project.id);

    if (updateError) {
      throw updateError;
    }

    console.log(`Uploaded ${project.title} -> ${publicUrl}`);
  }

  console.log('Project image migration complete.');
}

main().catch((error) => {
  console.error('Project image migration failed:', error.message || error);
  process.exitCode = 1;
});
