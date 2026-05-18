"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type Locale = "id" | "en";
const STORAGE_KEY = "cardte:locale";

/* ----------------------------- dictionaries ----------------------------- */

const id = {
  // Brand (jangan pernah diterjemahkan)
  "brand.name": "Cardte",
  "brand.tagline": "Dompet kartumu",

  // Bottom nav
  "nav.cards": "Cards",
  "nav.offers": "Offers",
  "nav.account": "Pengaturan",

  // Home
  "home.featured": "Pilihan",
  "home.featured_hint": "Tap untuk salin nomor",
  "home.search_placeholder": "Cari kartu...",
  "home.all_cards": "Semua kartu",
  "home.x_of_y": "{x} dari {y}",
  "home.no_match": "Tidak ada kartu yang cocok",
  "home.add_card_aria": "Tambah kartu",

  // Filters & stats
  "filter.all": "Semua",
  "filter.bank": "Bank",
  "filter.member": "Member",
  "stats.total": "Total",
  "stats.bank": "Bank",
  "stats.member": "Member",

  // Empty
  "empty.title": "Semua kartumu, satu tempat",
  "empty.subtitle":
    "Simpan kartu bank dan member di sini. Aman tersimpan di perangkatmu, tanpa server.",
  "empty.cta": "Tambah kartu pertama",

  // Hero
  "hero.card_number": "Nomor Kartu",
  "hero.holder_prefix": "a.n.",
  "hero.copy": "Salin",
  "hero.no_number": "Belum ada nomor",
  "hero.prev": "Kartu sebelumnya",
  "hero.next": "Kartu berikutnya",
  "hero.dot_aria": "Kartu {n}",

  // Card grid item
  "grid.no_number": "Belum ada nomor",
  "grid.copy_aria": "Salin nomor {name}",
  "grid.edit_aria": "Edit {name}",

  // Toasts
  "toast.copied": "Nomor {name} disalin",
  "toast.copy_failed": "Gagal menyalin",
  "toast.no_number": "Nomor belum diisi",
  "toast.saved": "Perubahan disimpan",

  // Add sheet
  "add.cancel": "Batal",
  "add.title": "Tambah Kartu",
  "add.search": "Cari kartu",
  "add.frequent": "Sering ditambahkan",
  "add.other": "Kartu lain",
  "add.no_results": "Tidak ada hasil",
  "add.bank_label": "Bank",
  "add.member_label": "Member",

  // Barcode scan
  "scan.subtitle": "Pindai barcode kartumu",
  "scan.cant_scan": "Kartumu tidak bisa di-scan?",
  "scan.enter_manually": "Masukkan manual",
  "scan.add_from_photo": "Tambahkan dari foto",
  "scan.camera_denied":
    "Kamera tidak tersedia. Masukkan nomor secara manual.",
  "scan.no_code": "Barcode tidak ditemukan di gambar.",
  "scan.no_detector":
    "Pemindai barcode tidak didukung di browser ini.",
  "scan.scanned": "Barcode terbaca",

  // Barcode display / presentation
  "barcode.hide_label": "Sembunyikan barcode",
  "barcode.hide_caption": "Hanya tampilkan nomor di detail kartu",
  "barcode.tap_hint": "Tap barcode untuk tampilan kasir",
  "barcode.present_close": "Tutup",
  "barcode.present_rotate": "Putar",
  "barcode.no_wakelock":
    "Layar mungkin akan mati otomatis di browser ini.",

  // Hero toggle
  "hero.toggle_title": "Hero Card",
  "hero.toggle_caption": "Jadikan kartu utama versi premium",

  // Detail sheet
  "detail.edit_title": "Edit Kartu",
  "detail.edit": "Edit",
  "detail.save": "Simpan",
  "detail.copy_hint": "Tap kartu untuk menyalin nomor",
  "detail.delete": "Hapus kartu",
  "detail.delete_confirm": "Hapus kartu ini?",

  // Field labels
  "field.name": "Nama",
  "field.number": "Nomor / ID kartu",
  "field.number_optional": "Nomor / ID kartu (opsional)",
  "field.number_placeholder": "cth. 1234567890",
  "field.holder": "Atas nama",
  "field.holder_placeholder": "cth. Cardte",
  "field.note": "Catatan",
  "field.note_placeholder": "Tambahkan catatan (opsional)",

  // Custom sheet
  "custom.title": "Kartu Lain",
  "custom.name_placeholder": "cth. Toko Buku Andi",
  "custom.preview_default": "Nama Kartu",
  "custom.color": "Warna",
  "custom.color_aria": "Warna {hex}",

  // Common
  "common.close": "Tutup",

  // Offers
  "offers.kicker": "Offers",
  "offers.coming_soon": "Segera hadir",
  "offers.coming_subtitle":
    "Promo dan rekomendasi dari kartumu akan tampil di sini.",

  // Account
  "account.kicker": "Akun",
  "account.privacy_title": "Privasi terjaga",
  "account.privacy_body":
    "Aplikasi ini tidak menggunakan database. Semua kartu disimpan di perangkatmu sendiri menggunakan local storage. Tidak ada data dikirim ke server.",
  "account.saved_count": "Kartu tersimpan",
  "account.language": "Bahasa",
  "account.language_id": "Indonesia",
  "account.language_en": "English",
  "account.export": "Ekspor data (.json)",
  "account.import": "Impor data (.json)",
  "account.clear": "Hapus semua kartu",
  "account.clear_confirm":
    "Yakin ingin menghapus semua kartu? Tindakan ini tidak bisa dibatalkan.",
  "account.import_ok": "Berhasil mengimpor {count} kartu",
  "account.import_fail": "Gagal mengimpor file",
  "account.cleared": "Semua kartu telah dihapus",
  "account.footer": "v0.1 — dibuat dengan ❤️ di Indonesia",

  // Advanced settings
  "adv.title": "Pengaturan Lanjutan",
  "adv.lock_title": "Kunci dengan Biometrik",
  "adv.lock_state_on": "Aktif",
  "adv.lock_state_off": "Nonaktif",
  "adv.sort_title": "Urutan kartu",
  "adv.sort_name": "Nama",
  "adv.sort_recent": "Terbaru",
  "adv.danger_question": "Ingin berhenti memakai Cardte?",
  "adv.danger_action": "Hapus semua data dari aplikasi",
  "adv.danger_confirm":
    "Tindakan ini akan menghapus semua kartu, PIN, dan biometrik. Lanjutkan?",

  // Lock screen
  "lock.setup_title": "Kunci dengan Biometrik",
  "lock.setup_body":
    "Gunakan biometrik perangkat untuk mengunci Cardte. Sebagai cadangan, masukkan PIN.",
  "lock.pin_label": "PIN",
  "lock.pin_placeholder": "PIN (4-8 digit)",
  "lock.confirm_label": "Konfirmasi PIN",
  "lock.enable_biometric": "AKTIFKAN BIOMETRIK",
  "lock.enable_pin_only": "AKTIFKAN PIN SAJA",
  "lock.disable": "Matikan Kunci",
  "lock.disable_confirm":
    "Masukkan PIN untuk mematikan kunci.",
  "lock.unlock_title": "Cardte Terkunci",
  "lock.unlock_subtitle": "Buka dengan biometrik atau PIN.",
  "lock.use_biometric": "Buka dengan Biometrik",
  "lock.wrong_pin": "PIN salah",
  "lock.pin_mismatch": "PIN tidak cocok",
  "lock.pin_too_short": "Minimal 4 digit",
  "lock.bio_failed": "Biometrik gagal, gunakan PIN.",
  "lock.bio_unsupported": "Biometrik tidak didukung di perangkat ini.",
  "lock.enabled": "Kunci diaktifkan",
  "lock.disabled": "Kunci dinonaktifkan",

  // Account row to advanced
  "account.advanced": "Pengaturan Lanjutan",

  // Sort sheet
  "sort.title": "Urutan kartu",
  "sort.by_name": "Berdasarkan nama",
  "sort.by_name_caption": "A → Z",
  "sort.by_recent": "Terbaru ditambahkan",
  "sort.by_recent_caption": "Yang baru di atas",
} as const;

type DictKey = keyof typeof id;

const en: Record<DictKey, string> = {
  "brand.name": "Cardte",
  "brand.tagline": "Your card wallet",

  "nav.cards": "Cards",
  "nav.offers": "Offers",
  "nav.account": "Settings",

  "home.featured": "Featured",
  "home.featured_hint": "Tap to copy number",
  "home.search_placeholder": "Search cards...",
  "home.all_cards": "All cards",
  "home.x_of_y": "{x} of {y}",
  "home.no_match": "No matching cards",
  "home.add_card_aria": "Add card",

  "filter.all": "All",
  "filter.bank": "Bank",
  "filter.member": "Member",
  "stats.total": "Total",
  "stats.bank": "Bank",
  "stats.member": "Member",

  "empty.title": "All your cards, one place",
  "empty.subtitle":
    "Keep your bank and member cards here. Safely stored on your device, no server needed.",
  "empty.cta": "Add your first card",

  "hero.card_number": "Card Number",
  "hero.holder_prefix": "Holder",
  "hero.copy": "Copy",
  "hero.no_number": "No number yet",
  "hero.prev": "Previous card",
  "hero.next": "Next card",
  "hero.dot_aria": "Card {n}",

  "grid.no_number": "No number yet",
  "grid.copy_aria": "Copy {name} number",
  "grid.edit_aria": "Edit {name}",

  "toast.copied": "{name} number copied",
  "toast.copy_failed": "Failed to copy",
  "toast.no_number": "No number yet",
  "toast.saved": "Changes saved",

  "add.cancel": "Cancel",
  "add.title": "Add Card",
  "add.search": "Search card",
  "add.frequent": "Frequently added",
  "add.other": "Other card",
  "add.no_results": "No results",
  "add.bank_label": "Bank",
  "add.member_label": "Member",

  "scan.subtitle": "Scan your card's barcode",
  "scan.cant_scan": "Your card won't scan?",
  "scan.enter_manually": "Enter manually",
  "scan.add_from_photo": "Add from photo",
  "scan.camera_denied":
    "Camera unavailable. Enter the number manually.",
  "scan.no_code": "No barcode found in the image.",
  "scan.no_detector":
    "Barcode scanning isn't supported in this browser.",
  "scan.scanned": "Barcode detected",

  "barcode.hide_label": "Hide barcode",
  "barcode.hide_caption": "Only show the number on the card detail",
  "barcode.tap_hint": "Tap the barcode for cashier view",
  "barcode.present_close": "Close",
  "barcode.present_rotate": "Rotate",
  "barcode.no_wakelock":
    "Screen may dim automatically in this browser.",

  "hero.toggle_title": "Hero Card",
  "hero.toggle_caption": "Make this your featured premium card",

  "detail.edit_title": "Edit Card",
  "detail.edit": "Edit",
  "detail.save": "Save",
  "detail.copy_hint": "Tap the card to copy its number",
  "detail.delete": "Delete card",
  "detail.delete_confirm": "Delete this card?",

  "field.name": "Name",
  "field.number": "Card number / ID",
  "field.number_optional": "Card number / ID (optional)",
  "field.number_placeholder": "e.g. 1234567890",
  "field.holder": "Cardholder name",
  "field.holder_placeholder": "e.g. Cardte",
  "field.note": "Note",
  "field.note_placeholder": "Add a note (optional)",

  "custom.title": "Other Card",
  "custom.name_placeholder": "e.g. Andi's Bookstore",
  "custom.preview_default": "Card name",
  "custom.color": "Color",
  "custom.color_aria": "Color {hex}",

  "common.close": "Close",

  "offers.kicker": "Offers",
  "offers.coming_soon": "Coming soon",
  "offers.coming_subtitle":
    "Promotions and recommendations from your cards will appear here.",

  "account.kicker": "Account",
  "account.privacy_title": "Privacy first",
  "account.privacy_body":
    "This app uses no database. All cards are stored on your own device via local storage. Nothing is sent to a server.",
  "account.saved_count": "Saved cards",
  "account.language": "Language",
  "account.language_id": "Indonesian",
  "account.language_en": "English",
  "account.export": "Export data (.json)",
  "account.import": "Import data (.json)",
  "account.clear": "Delete all cards",
  "account.clear_confirm":
    "Delete all cards? This action cannot be undone.",
  "account.import_ok": "Imported {count} cards",
  "account.import_fail": "Failed to import file",
  "account.cleared": "All cards deleted",
  "account.footer": "v0.1 — made with ❤️ in Indonesia",

  "adv.title": "Advanced Settings",
  "adv.lock_title": "Lock with Biometrics",
  "adv.lock_state_on": "Enabled",
  "adv.lock_state_off": "Disabled",
  "adv.sort_title": "Sort cards list",
  "adv.sort_name": "Name",
  "adv.sort_recent": "Recent",
  "adv.danger_question": "Want to break up with us?",
  "adv.danger_action": "Delete all data from the app",
  "adv.danger_confirm":
    "This will erase all cards, PIN, and biometrics. Continue?",

  "lock.setup_title": "Lock with Biometrics",
  "lock.setup_body":
    "Use device biometrics to lock Cardte. As a fallback, enter a PIN.",
  "lock.pin_label": "PIN",
  "lock.pin_placeholder": "PIN (4-8 digits)",
  "lock.confirm_label": "Confirm PIN",
  "lock.enable_biometric": "ENABLE BIOMETRICS",
  "lock.enable_pin_only": "ENABLE PIN ONLY",
  "lock.disable": "Turn off Lock",
  "lock.disable_confirm":
    "Enter PIN to turn off lock.",
  "lock.unlock_title": "Cardte Locked",
  "lock.unlock_subtitle": "Unlock with biometrics or PIN.",
  "lock.use_biometric": "Unlock with Biometrics",
  "lock.wrong_pin": "Wrong PIN",
  "lock.pin_mismatch": "PINs don't match",
  "lock.pin_too_short": "Minimum 4 digits",
  "lock.bio_failed": "Biometrics failed, use PIN.",
  "lock.bio_unsupported": "Biometrics not supported on this device.",
  "lock.enabled": "Lock enabled",
  "lock.disabled": "Lock disabled",

  "account.advanced": "Advanced Settings",

  "sort.title": "Sort cards list",
  "sort.by_name": "By name",
  "sort.by_name_caption": "A → Z",
  "sort.by_recent": "Recently added",
  "sort.by_recent_caption": "Newest first",
};

const dicts: Record<Locale, Record<DictKey, string>> = { id, en };

/* ------------------------------- context ------------------------------- */

type Ctx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: DictKey, vars?: Record<string, string | number>) => string;
};

const I18nCtx = createContext<Ctx>({
  locale: "id",
  setLocale: () => {},
  t: (k) => String(k),
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("id");

  // Hydrate from storage / browser
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (stored === "id" || stored === "en") {
        setLocaleState(stored);
        return;
      }
      const lang = (navigator.language || "").toLowerCase();
      if (lang.startsWith("en")) setLocaleState("en");
    } catch {
      /* ignore */
    }
  }, []);

  // Reflect on <html lang>
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const t = useCallback<Ctx["t"]>(
    (key, vars) => {
      let str = dicts[locale][key] ?? id[key] ?? String(key);
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          str = str.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
        }
      }
      return str;
    },
    [locale]
  );

  return (
    <I18nCtx.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nCtx.Provider>
  );
}

export function useT() {
  return useContext(I18nCtx);
}
