// database.js - Supabase Rating Integration for Anya's Portfolio
// Real-time database connection untuk rating & feedback sistem

const SupabaseConfig = {
    url: 'https://nlnmhjnoyfhusmllympq.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5sbm1oam5veWZodXNtbGx5bXBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc0MDAxNjMsImV4cCI6MjEwMjk3NjE2M30.9urcZQ9B1mYivgvsUhOpDrvGGZDP312qAwXZeQCK9o0'
};

let supabase = null;

/**
 * Inisialisasi koneksi Supabase.
 * Membutuhkan Supabase JS Client library sudah ter-load di HTML.
 */
function initSupabase(url, anonKey) {
    if (url) SupabaseConfig.url = url;
    if (anonKey) SupabaseConfig.anonKey = anonKey;

    if (SupabaseConfig.url === 'SUPABASE_URL_PLACEHOLDER' || SupabaseConfig.anonKey === 'SUPABASE_API_KEY_PLACEHOLDER') {
        console.warn('[Supabase] URL atau API Key belum dikonfigurasi. Rating system dinonaktifkan.');
        return false;
    }

    // Cek apakah Supabase client sudah ter-load
    const supabaseLib = window.supabase;
    if (!supabaseLib || !supabaseLib.createClient) {
        console.error('[Supabase] Supabase JS Client library tidak ditemukan. Tambahkan script CDN terlebih dahulu.');
        return false;
    }

    try {
        supabase = supabaseLib.createClient(SupabaseConfig.url, SupabaseConfig.anonKey);
        console.log('[Supabase] ✅ Koneksi berhasil diinisialisasi!');
        return true;
    } catch (err) {
        console.error('[Supabase] Gagal inisialisasi:', err);
        return false;
    }
}

/**
 * Ambil rata-rata rating dan total count dari tabel 'ratings'.
 * @returns {Promise<{average: number, count: number}>}
 */
async function getRatings() {
    if (!supabase) {
        console.warn('[Supabase] Database belum terhubung.');
        return { average: 0, count: 0 };
    }

    try {
        const { data, error } = await supabase
            .from('ratings')
            .select('rating');

        if (error) throw error;

        if (!data || data.length === 0) {
            return { average: 0, count: 0 };
        }

        const total = data.reduce((acc, curr) => acc + curr.rating, 0);
        const average = total / data.length;

        return { average: parseFloat(average.toFixed(1)), count: data.length };
    } catch (error) {
        console.error('[Supabase] Gagal mengambil rating:', error.message);
        return { average: 0, count: 0 };
    }
}

/**
 * Kirim rating baru ke tabel 'ratings'.
 * @param {number} rating - Nilai rating (1-5)
 * @param {string} comment - Komentar opsional dari pengunjung
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
async function submitRating(rating, comment = '') {
    if (!supabase) {
        return { success: false, error: 'Supabase belum terhubung.' };
    }

    if (rating < 1 || rating > 5) {
        return { success: false, error: 'Rating harus antara 1 hingga 5.' };
    }

    try {
        const { data, error } = await supabase
            .from('ratings')
            .insert([
                {
                    rating,
                    comment: comment.trim(),
                    created_at: new Date().toISOString()
                }
            ])
            .select();

        if (error) throw error;

        console.log('[Supabase] Rating berhasil dikirim:', data);
        return { success: true, data };
    } catch (error) {
        console.error('[Supabase] Gagal mengirim rating:', error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Ambil semua review dari tabel 'ratings' dengan limit tertentu.
 * @param {number} limit - Jumlah maksimum review yang diambil
 * @returns {Promise<Array>}
 */
async function getReviews(limit = 10) {
    if (!supabase) {
        return [];
    }

    try {
        const { data, error } = await supabase
            .from('ratings')
            .select('rating, comment, created_at')
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;

        return data || [];
    } catch (error) {
        console.error('[Supabase] Gagal mengambil reviews:', error.message);
        return [];
    }
}

/**
 * Subscribe ke real-time updates dari tabel 'ratings'.
 * @param {Function} callback - Fungsi yang dipanggil saat ada update
 */
function subscribeToRatings(callback) {
    if (!supabase) {
        console.warn('[Supabase] Database belum terhubung.');
        return;
    }

    const subscription = supabase
        .channel('ratings-feed')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'ratings' }, (payload) => {
            console.log('[Supabase] Real-time update:', payload);
            callback(payload);
        })
        .subscribe();

    return subscription;
}

// Auto-init jika config sudah lengkap (bukan placeholder)
if (SupabaseConfig.url !== 'SUPABASE_URL_PLACEHOLDER' && SupabaseConfig.anonKey !== 'SUPABASE_API_KEY_PLACEHOLDER') {
    document.addEventListener('DOMContentLoaded', () => {
        initSupabase();
    });
}

// Expose ke window untuk dipakai di script.js
window.PortfolioSupabase = {
    initSupabase,
    getRatings,
    submitRating,
    getReviews,
    subscribeToRatings
};
