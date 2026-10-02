const { supabase, sql } = require('./db');

const initialShoppingItems = [
  {
    name: 'Kemeja Flannel Casual Pria',
    description: 'Kemeja flannel motif kotak berbahan katun lembut dan nyaman untuk sehari-hari.',
    price: 185000,
    stock: 25,
    is_available: true,
    image_url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop&q=60',
  },
  {
    name: 'Sepatu Sneaker Sport White',
    description: 'Sepatu sneaker kasual ringan dengan bantalan empuk, cocok untuk olahraga dan hangout.',
    price: 349000,
    stock: 15,
    is_available: true,
    image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60',
  },
  {
    name: 'Tas Ransel Laptop Waterproof',
    description: 'Backpack kapasitas 20L dengan slot laptop 15.6 inch dan bahan tahan air.',
    price: 249000,
    stock: 30,
    is_available: true,
    image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60',
  },
  {
    name: 'Jam Tangan Minimalis Analog',
    description: 'Jam tangan elegan dengan tali kulit sintetis hitam dan water resistant 3 ATM.',
    price: 299000,
    stock: 18,
    is_available: true,
    image_url: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500&auto=format&fit=crop&q=60',
  },
  {
    name: 'Headphone Wireless Bluetooth 5.3',
    description: 'Headphone over-ear dengan suara bass mendalam, peredam bising, dan baterai hingga 40 jam.',
    price: 479000,
    stock: 12,
    is_available: true,
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60',
  },
  {
    name: 'Tumbler Stainless Steel 500ml',
    description: 'Botol termos tahan panas dan dingin hingga 12 jam, bebas BPA dan anti bocor.',
    price: 95000,
    stock: 50,
    is_available: true,
    image_url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=60',
  },
];

async function seed() {
  console.log('🌱 Memulai proses seeding data shopping ke Supabase...');

  if (sql) {
    try {
      console.log('⚡ Menggunakan direct SQL connection (library postgres)...');

      for (const item of initialShoppingItems) {
        // Cek jika item dengan nama ini sudah ada
        const existing = await sql`SELECT id FROM items WHERE name = ${item.name} LIMIT 1`;

        if (existing.length > 0) {
          await sql`
            UPDATE items 
            SET 
              description = ${item.description},
              price = ${item.price},
              stock = ${item.stock},
              is_available = ${item.is_available},
              image_url = ${item.image_url}
            WHERE id = ${existing[0].id}
          `;
        } else {
          await sql`
            INSERT INTO items (name, description, price, stock, is_available, image_url)
            VALUES (${item.name}, ${item.description}, ${item.price}, ${item.stock}, ${item.is_available}, ${item.image_url})
          `;
        }
      }

      console.log(`✅ Berhasil seeding ${initialShoppingItems.length} produk shopping via SQL!`);
      const allRows = await sql`SELECT id, name, price, stock FROM items ORDER BY id ASC`;
      console.table(
        allRows.map((r) => ({
          ID: r.id,
          Nama: r.name,
          Harga: `Rp ${Number(r.price).toLocaleString('id-ID')}`,
          Stok: r.stock,
        }))
      );
      await sql.end();
      return;
    } catch (sqlErr) {
      console.error('❌ Gagal seeding via SQL:', sqlErr.message);
      await sql.end();
      return;
    }
  }

  // Fallback REST Supabase
  try {
    const { data, error } = await supabase
      .from('items')
      .upsert(initialShoppingItems, { onConflict: 'name' })
      .select();

    if (error) throw error;
    console.log(`✅ Berhasil seeding ke Supabase REST!`);
  } catch (err) {
    console.error('❌ Gagal melakukan seeding:', err.message || err);
  }
}

seed();
