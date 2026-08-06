const { supabase } = require('../server/supabase');
const { TABLES } = require('../server/portfolioStore');

function calculateValues(price, originalPrice, discountPercent) {
  if (price && (!originalPrice || !discountPercent)) {
    const cleanedPrice = price.replace(/,/g, '');
    const numericMatch = cleanedPrice.match(/\d+/);
    if (numericMatch) {
      const currentPriceNum = parseFloat(numericMatch[0]);
      if (currentPriceNum > 0) {
        if (!discountPercent) {
          discountPercent = '25% off';
        }
        if (!originalPrice) {
          const originalPriceNum = Math.round(currentPriceNum / 0.75);
          const hasCommas = price.includes(',');
          let formattedOriginal = originalPriceNum.toString();
          if (hasCommas) {
            formattedOriginal = originalPriceNum.toLocaleString('en-US');
          }
          const rawNumIndex = price.search(/\d/);
          let prefix = '';
          let suffix = '';
          if (rawNumIndex !== -1) {
            prefix = price.substring(0, rawNumIndex);
            const suffixMatch = price.substring(rawNumIndex).match(/^[\d,]+/);
            if (suffixMatch) {
              suffix = price.substring(rawNumIndex + suffixMatch[0].length);
            }
          }
          originalPrice = `${prefix}${formattedOriginal}${suffix}`;
        }
      }
    }
  }
  return { originalPrice, discountPercent };
}

async function run() {
  console.log('Fetching all pricing packages...');
  const { data: packages, error } = await supabase
    .from(TABLES.pricingPackages)
    .select('*');

  if (error) {
    console.error('Error fetching packages:', error);
    return;
  }

  console.log(`Found ${packages.length} packages. Checking for updates...`);
  let updateCount = 0;

  for (const pkg of packages) {
    const currentPrice = pkg.price;
    const oldOriginalPrice = pkg.original_price;
    const oldDiscountPercent = pkg.discount_percent;

    const { originalPrice, discountPercent } = calculateValues(currentPrice, oldOriginalPrice, oldDiscountPercent);

    if (originalPrice !== oldOriginalPrice || discountPercent !== oldDiscountPercent) {
      console.log(`Updating "${pkg.title}" - Original: "${originalPrice}", Discount: "${discountPercent}"`);
      const { error: updateError } = await supabase
        .from(TABLES.pricingPackages)
        .update({
          original_price: originalPrice,
          discount_percent: discountPercent
        })
        .eq('id', pkg.id);

      if (updateError) {
        console.error(`Failed to update package ${pkg.id}:`, updateError);
      } else {
        updateCount++;
      }
    }
  }

  console.log(`Successfully updated ${updateCount} packages in the database.`);
}

run().catch(console.error);
