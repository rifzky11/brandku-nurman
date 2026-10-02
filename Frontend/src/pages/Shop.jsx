import { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:5001/api/items";

function Shop() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Single Item detail modal/card (GET by ID)
  const [detailItem, setDetailItem] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // 1. GET ALL items from backend
  const fetchItems = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(API_BASE_URL);
      if (!res.ok) throw new Error("Gagal mengambil data dari server");
      const result = await res.json();
      setItems(result.data || []);
    } catch (err) {
      setError(err.message || "Gagal terkoneksi ke backend (port 5001)");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // 2. GET BY ID
  const fetchItemById = async (id) => {
    setDetailLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/${id}`);
      if (!res.ok) throw new Error("Item tidak ditemukan");
      const result = await res.json();
      setDetailItem(result.data);
    } catch (err) {
      alert(err.message);
    } finally {
      setDetailLoading(false);
    }
  };

  // 3. POST (Create) & 4. PUT (Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Nama produk wajib diisi");
      return;
    }

    const payload = {
      name: name.trim(),
      description: description.trim(),
      price: Number(price) || 0,
      stock: Number(stock) || 0,
      image_url: imageUrl.trim() || null,
    };

    try {
      if (editingId) {
        // PUT by ID
        const res = await fetch(`${API_BASE_URL}/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Gagal memperbarui item");
        setSuccessMessage("Produk berhasil diperbarui!");
      } else {
        // POST Create
        const res = await fetch(API_BASE_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Gagal menambahkan item");
        setSuccessMessage("Produk baru berhasil ditambahkan!");
      }

      resetForm();
      fetchItems();
      setTimeout(() => setSuccessMessage(""), 3500);
    } catch (err) {
      alert(err.message);
    }
  };

  // 5. DELETE BY ID
  const handleDelete = async (id) => {
    if (!window.confirm(`Yakin ingin menghapus produk dengan ID #${id}?`)) return;

    try {
      const res = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal menghapus produk");

      setSuccessMessage("Produk berhasil dihapus!");
      if (editingId === id) resetForm();
      if (detailItem && detailItem.id === id) setDetailItem(null);
      fetchItems();
      setTimeout(() => setSuccessMessage(""), 3500);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setName(item.name || "");
    setDescription(item.description || "");
    setPrice(item.price || "");
    setStock(item.stock !== undefined ? item.stock : "");
    setImageUrl(item.image_url || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setDescription("");
    setPrice("");
    setStock("");
    setImageUrl("");
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header Halaman */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Koleksi Produk & Manajemen Toko
          </h1>
        </div>

        <button
          onClick={fetchItems}
          type="button"
          className="self-start rounded-lg bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 transition"
        >
          🔄 Refresh Produk
        </button>
      </div>

      {/* Alert Messages */}
      {successMessage && (
        <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800 shadow-sm">
          ✅ {successMessage}
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700 shadow-sm">
          ⚠️ {error}
          <div className="mt-2 text-xs text-red-600">
            Pastikan server backend sudah menyala di terminal dengan perintah:{" "}
            <code className="rounded bg-red-100 px-1 py-0.5 font-mono">npm run dev</code> di folder backend.
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Form Tambah & Edit Produk */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              {editingId ? `✏️ Edit Produk #${editingId}` : "➕ Tambah Produk Baru"}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              {editingId
                ? "Mengirim update data via method PUT"
                : "Menyimpan produk baru via method POST"}
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Produk *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kemeja Flannel Pria"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Harga (Rp)
                  </label>
                  <input
                    type="number"
                    placeholder="150000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Stok
                  </label>
                  <input
                    type="number"
                    placeholder="10"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  URL Gambar
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Deskripsi
                </label>
                <textarea
                  rows={3}
                  placeholder="Deskripsi produk shopping..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
                >
                  {editingId ? "Update Produk (PUT)" : "Simpan Produk (POST)"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
                  >
                    Batal
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Daftar Produk (GET ALL) */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">
              Daftar Produk Toko ({items.length})
            </h2>
            <span className="text-xs font-mono text-slate-500">GET /api/items</span>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent mb-2"></div>
              <p>Sedang memuat data dari database...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
              Belum ada produk di database. Silakan isi form di sebelah kiri atau jalankan seed!
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition"
                >
                  {/* Gambar Produk */}
                  <div className="relative flex h-48 w-full items-center justify-center bg-slate-50 p-4 overflow-hidden">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="h-full w-full object-cover rounded-lg"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="text-4xl text-slate-300">🛍️</div>
                    )}
                    <span className="absolute top-3 left-3 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-bold text-slate-700 shadow-sm backdrop-blur-sm">
                      ID #{item.id}
                    </span>
                    {item.stock !== undefined && (
                      <span className="absolute top-3 right-3 rounded-full bg-slate-900/80 px-2 py-0.5 text-xs font-medium text-white shadow-sm backdrop-blur-sm">
                        Stok: {item.stock}
                      </span>
                    )}
                  </div>

                  {/* Konten Produk */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="line-clamp-1 text-base font-bold text-slate-900">
                        {item.name}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                        {item.description || "Tidak ada deskripsi produk."}
                      </p>
                      <p className="mt-3 text-lg font-extrabold text-emerald-600">
                        Rp {Number(item.price || 0).toLocaleString("id-ID")}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                      <button
                        type="button"
                        onClick={() => fetchItemById(item.id)}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition"
                      >
                        🔍 Detail
                      </button>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(item)}
                          className="rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 hover:bg-amber-100 transition"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          className="rounded-lg bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 hover:bg-red-100 transition"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Modal / Card Detail (GET by ID) */}
          {detailItem && (
            <div className="mt-6 rounded-2xl border-2 border-blue-200 bg-blue-50/70 p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-800">
                  🔍 Detail Produk (GET /api/items/{detailItem.id})
                </span>
                <button
                  type="button"
                  onClick={() => setDetailItem(null)}
                  className="rounded px-2 py-1 text-sm font-bold text-slate-400 hover:text-slate-700"
                >
                  ✕ Tutup
                </button>
              </div>

              {detailLoading ? (
                <p className="mt-3 text-sm text-slate-500">Memuat detail...</p>
              ) : (
                <div className="mt-4 flex flex-col sm:flex-row gap-5">
                  {detailItem.image_url && (
                    <img
                      src={detailItem.image_url}
                      alt={detailItem.name}
                      className="h-32 w-32 object-cover rounded-xl border border-blue-100"
                    />
                  )}
                  <div className="space-y-1 text-sm">
                    <h4 className="text-lg font-bold text-slate-900">
                      {detailItem.name}{" "}
                      <span className="text-xs font-normal text-slate-500">
                        (ID: #{detailItem.id})
                      </span>
                    </h4>
                    <div className="font-bold text-emerald-700">
                      Harga: Rp {Number(detailItem.price || 0).toLocaleString("id-ID")}
                    </div>
                    {detailItem.stock !== undefined && (
                      <div className="text-xs text-slate-600">
                        <span className="font-semibold">Stok:</span> {detailItem.stock} pcs
                      </div>
                    )}
                    <div className="text-xs text-slate-600">
                      <span className="font-semibold">Deskripsi:</span>{" "}
                      {detailItem.description || "-"}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default Shop;