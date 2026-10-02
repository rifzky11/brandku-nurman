const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const { supabase, sql } = require('./db');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory fallback
let inMemoryItems = [
  {
    id: 1,
    name: 'Kemeja Flannel Casual Pria',
    description: 'Kemeja flannel motif kotak berbahan katun lembut dan nyaman untuk sehari-hari.',
    price: 185000,
    stock: 25,
    is_available: true,
    image_url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop&q=60',
  },
  {
    id: 2,
    name: 'Sepatu Sneaker Sport White',
    description: 'Sepatu sneaker kasual ringan dengan bantalan empuk, cocok untuk olahraga dan hangout.',
    price: 349000,
    stock: 15,
    is_available: true,
    image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60',
  },
  {
    id: 3,
    name: 'Tas Ransel Laptop Waterproof',
    description: 'Backpack kapasitas 20L dengan slot laptop 15.6 inch dan bahan tahan air.',
    price: 249000,
    stock: 30,
    is_available: true,
    image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60',
  },
];
let nextId = 4;

const isSupabaseConfigured = () => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_KEY;
  return url && key && !url.includes('your-project-id');
};

// 1. GET ALL
app.get('/api/items', async (req, res) => {
  try {
    if (sql) {
      const data = await sql`SELECT * FROM items ORDER BY id ASC`;
      return res.json({ success: true, source: 'postgres-sql', data });
    }

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;
      return res.json({ success: true, source: 'supabase-api', data });
    }

    res.json({
      success: true,
      source: 'in-memory',
      data: inMemoryItems,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 2. GET BY ID
app.get('/api/items/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);

  try {
    if (sql) {
      const rows = await sql`SELECT * FROM items WHERE id = ${id}`;
      if (!rows.length) {
        return res.status(404).json({ success: false, message: `Item #${id} tidak ditemukan` });
      }
      return res.json({ success: true, source: 'postgres-sql', data: rows[0] });
    }

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        return res.status(404).json({ success: false, message: `Item #${id} tidak ditemukan` });
      }
      return res.json({ success: true, source: 'supabase-api', data });
    }

    const item = inMemoryItems.find((i) => i.id === id);
    if (!item) {
      return res.status(404).json({ success: false, message: `Item #${id} tidak ditemukan` });
    }
    res.json({ success: true, source: 'in-memory', data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 3. POST (Create)
app.post('/api/items', async (req, res) => {
  const { name, description, price, stock, image_url, is_available } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ success: false, message: 'Nama item wajib diisi' });
  }

  const newItemData = {
    name: name.trim(),
    description: description || '',
    price: Number(price) || 0,
    stock: stock !== undefined ? Number(stock) : 0,
    image_url: image_url || null,
    is_available: is_available !== undefined ? is_available : true,
  };

  try {
    if (sql) {
      const [inserted] = await sql`
        INSERT INTO items (name, description, price, stock, image_url, is_available)
        VALUES (${newItemData.name}, ${newItemData.description}, ${newItemData.price}, ${newItemData.stock}, ${newItemData.image_url}, ${newItemData.is_available})
        RETURNING *
      `;
      return res.status(201).json({ success: true, message: 'Item berhasil ditambahkan via SQL', data: inserted });
    }

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('items')
        .insert([newItemData])
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json({ success: true, message: 'Item berhasil ditambahkan ke Supabase', data });
    }

    const newItem = { id: nextId++, ...newItemData };
    inMemoryItems.push(newItem);
    res.status(201).json({ success: true, message: 'Item berhasil ditambahkan (in-memory)', data: newItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 4. PUT BY ID (Update)
app.put('/api/items/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { name, description, price, stock, image_url, is_available } = req.body;

  try {
    if (sql) {
      const [updated] = await sql`
        UPDATE items
        SET 
          name = COALESCE(${name !== undefined ? name : null}, name),
          description = COALESCE(${description !== undefined ? description : null}, description),
          price = COALESCE(${price !== undefined ? Number(price) : null}, price),
          stock = COALESCE(${stock !== undefined ? Number(stock) : null}, stock),
          image_url = COALESCE(${image_url !== undefined ? image_url : null}, image_url),
          is_available = COALESCE(${is_available !== undefined ? is_available : null}, is_available)
        WHERE id = ${id}
        RETURNING *
      `;
      if (!updated) {
        return res.status(404).json({ success: false, message: `Item #${id} tidak ditemukan` });
      }
      return res.json({ success: true, message: 'Item berhasil diperbarui via SQL', data: updated });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = Number(price);
    if (stock !== undefined) updateData.stock = Number(stock);
    if (image_url !== undefined) updateData.image_url = image_url;
    if (is_available !== undefined) updateData.is_available = is_available;

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('items')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error || !data) {
        return res.status(404).json({ success: false, message: `Item #${id} tidak ditemukan` });
      }
      return res.json({ success: true, message: 'Item berhasil diperbarui di Supabase', data });
    }

    const itemIndex = inMemoryItems.findIndex((i) => i.id === id);
    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: `Item #${id} tidak ditemukan` });
    }
    inMemoryItems[itemIndex] = { ...inMemoryItems[itemIndex], ...updateData };
    res.json({ success: true, message: 'Item berhasil diperbarui (in-memory)', data: inMemoryItems[itemIndex] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 5. DELETE BY ID
app.delete('/api/items/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);

  try {
    if (sql) {
      const [deleted] = await sql`DELETE FROM items WHERE id = ${id} RETURNING *`;
      if (!deleted) {
        return res.status(404).json({ success: false, message: `Item #${id} tidak ditemukan` });
      }
      return res.json({ success: true, message: 'Item berhasil dihapus via SQL', data: deleted });
    }

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('items')
        .delete()
        .eq('id', id)
        .select()
        .single();

      if (error || !data) {
        return res.status(404).json({ success: false, message: `Item #${id} tidak ditemukan` });
      }
      return res.json({ success: true, message: 'Item berhasil dihapus dari Supabase', data });
    }

    const itemIndex = inMemoryItems.findIndex((i) => i.id === id);
    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: `Item #${id} tidak ditemukan` });
    }
    const deletedItem = inMemoryItems.splice(itemIndex, 1)[0];
    res.json({ success: true, message: 'Item berhasil dihapus (in-memory)', data: deletedItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  if (sql) {
    console.log('⚡ Connected via Direct PostgreSQL SQL client');
  } else if (isSupabaseConfigured()) {
    console.log('⚡ Connected to Supabase REST API');
  } else {
    console.log('ℹ️ Running in-memory mode.');
  }
});