const { supabase } = require('../server/supabase');
const { TABLES } = require('../server/portfolioStore');
const { pricingSeedServices } = require('../server/pricingSeedData');

function servicePayload(service) {
  return {
    service_key: service.serviceKey,
    label: service.label,
    icon: service.icon,
    intro: service.intro,
    display_order: service.displayOrder,
    active: service.active !== false,
  };
}

function packagePayload(serviceId, item) {
  return {
    service_id: serviceId,
    tier: item.tier,
    title: item.title,
    price: item.price,
    original_price: item.originalPrice || '',
    discount_percent: item.discountPercent || '',
    description: item.description,
    delivery: item.delivery,
    badge: item.badge || '',
    button: item.button,
    features: item.features,
    unavailable: item.unavailable,
    display_order: item.displayOrder,
    active: item.active !== false,
  };
}

async function main() {
  let packageCount = 0;

  for (const service of pricingSeedServices) {
    const { data: savedService, error: serviceError } = await supabase
      .from(TABLES.pricingServices)
      .upsert(servicePayload(service), { onConflict: 'service_key' })
      .select('*')
      .single();

    if (serviceError) {
      throw serviceError;
    }

    const packageRows = service.packages.map((item) => packagePayload(savedService.id, item));
    const { error: packageError } = await supabase
      .from(TABLES.pricingPackages)
      .upsert(packageRows, { onConflict: 'service_id,title' });

    if (packageError) {
      throw packageError;
    }

    packageCount += packageRows.length;
  }

  console.log(`Seeded ${pricingSeedServices.length} pricing services and ${packageCount} pricing packages.`);
}

main().catch((error) => {
  console.error('Pricing seed failed:', error);
  process.exitCode = 1;
});
