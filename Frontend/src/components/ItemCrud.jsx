import { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:5001/api/items";

const ItemCrud = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Single Item detail modal/view
  const [detailItem, setDetailItem] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // 1. GET ALL
  const fetchItems = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(API_BASE_URL);
      if (!res.ok) throw new Error("Gagal mengambil data dari server");
      const result = await res.json();
      setItems(result.data || []);
    } catch (err) {
      setError(err.message || "Gagal terkoneksi ke server backend (port 5001)");
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
        setSuccessMessage("Item berhasil diperbarui!");
      } else {
        // POST Create
        const res = await fetch(API_BASE_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Gagal menambahkan item");
        setSuccessMessage("Item baru berhasil ditambahkan!");
      }

      // Reset form
      resetForm();
      fetchItems();
      setTimeout(() => setSuccessMessage(""), 3500);
    } catch (err) {
      alert(err.message);
    }
  };

  // 5. DELETE BY ID
  const handleDelete = async (id) => {
    if (!window.confirm(`Yakin ingin menghapus item dengan ID ${id}?`)) return;

    try {
      const res = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal menghapus item");

      setSuccessMessage("Item berhasil dihapus!");
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
    setName(item.name);
    setDescription(item.description || "");
    setPrice(item.price || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setDescription("");
    setPrice("");
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Manajemen Produk (CRUD API)
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Terhubung langsung dengan endpoint Backend Express.js di{" "}
            <code className="rounded bg-slate-100 px-2 py-0.5 font-mono text-emerald-700">
              http://localhost:5001/api/items
            </code>
          </p>
        </div>

        <button
          onClick={fetchItems}
          type="button"
          className="self-start rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition"
        >
          🔄 Refresh Data
        </button>
      </div>

      {successMessage && (
        <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
          ✅ {successMessage}
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          ⚠️ {error}
          <div className="mt-2 text-xs text-red-600">
            Pastikan server backend sudah dijalankan dengan: <code className="font-mono bg-red-100 px-1 py-0.5 rounded">npm run dev</code> di folder backend.
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Form Create / Update */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              {editingId ? `✏️ Edit Item #${editingId}` : "➕ Tambah Item Baru"}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              {editingId
                ? "Mengirim request method PUT ke /api/items/:id"
                : "Mengirim request method POST ke /api/items"}
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Item *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Sepatu Sneakers"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Harga (Rp)
                </label>
                <input
                  type="number"
                  placeholder="Contoh: 150000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Deskripsi
                </label>
                <textarea
                  rows={3}
                  placeholder="Deskripsi singkat produk..."
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
                  {editingId ? "Update Item (PUT)" : "Simpan (POST)"}
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

        {/* List Items (GET ALL) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              Daftar Items ({items.length})
            </h2>
            <span className="text-xs text-slate-500">Method GET /api/items</span>
          </div>

          {loading ? (
            <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-500">
              Sedang memuat data...
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
              Belum ada item. Silakan tambahkan item pertama lewat form di sebelah kiri!
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow transition"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="inline-block rounded bg-slate-100 px-2 py-0.5 text-xs font-mono font-semibold text-slate-600">
                        ID #{item.id}
                      </span>
                      <span className="text-sm font-bold text-emerald-600">
                        Rp {Number(item.price || 0).toLocaleString("id-ID")}
                      </span>
                    </div>

                    <h3 className="mt-3 text-base font-bold text-slate-900 line-clamp-1">
                      {item.name}
                    </h3>

                    <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                      {item.description || "Tidak ada deskripsi"}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 gap-2">
                    <button
                      type="button"
                      onClick={() => fetchItemById(item.id)}
                      className="text-xs font-medium text-blue-600 hover:text-blue-800 transition"
                    >
                      🔍 Detail (GET :id)
                    </button>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(item)}
                        className="rounded px-2.5 py-1 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 transition"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="rounded px-2.5 py-1 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 transition"
                      >
                        Hapus (DELETE)
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Modal / Card Detail (GET by ID) */}
          {detailItem && (
            <div className="mt-6 rounded-2xl border-2 border-blue-200 bg-blue-50/50 p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                  Hasil GET /api/items/{detailItem.id}
                </span>
                <button
                  type="button"
                  onClick={() => setDetailItem(null)}
                  className="text-sm font-bold text-slate-400 hover:text-slate-600"
                >
                  ✕ Tutup
                </button>
              </div>

              {detailLoading ? (
                <p className="mt-2 text-sm text-slate-500">Memuat detail...</p>
              ) : (
                <div className="mt-3 space-y-2">
                  <div className="text-lg font-bold text-slate-900">
                    {detailItem.name}{" "}
                    <span className="text-sm font-normal text-slate-500">
                      (ID: {detailItem.id})
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-emerald-700">
                    Harga: Rp {Number(detailItem.price || 0).toLocaleString("id-ID")}
                  </div>
                  <div className="text-xs text-slate-600">
                    <span className="font-semibold">Deskripsi:</span>{" "}
                    {detailItem.description || "-"}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ItemCrud;
