import{_ as a,o as e,c as n,Q as i}from"./chunks/framework.ec8f7e8e.js";const g=JSON.parse('{"title":"Recovery dari bootloop","description":"","frontmatter":{},"headers":[],"relativePath":"id_ID/guide/rescue-from-bootloop.md","filePath":"id_ID/guide/rescue-from-bootloop.md"}'),t={name:"id_ID/guide/rescue-from-bootloop.md"},m=i('<h1 id="recovery-dari-bootloop" tabindex="-1">Recovery dari bootloop <a class="header-anchor" href="#recovery-dari-bootloop" aria-label="Permalink to &quot;Recovery dari bootloop&quot;">​</a></h1><p>Saat mem-flash perangkat, kami mungkin menghadapi situasi di mana perangkat menjadi &quot;bata&quot;. Secara teori, jika Anda hanya menggunakan fastboot untuk mem-flash partisi boot atau menginstal modul yang tidak sesuai yang menyebabkan perangkat gagal melakukan booting, ini dapat dipulihkan dengan operasi yang sesuai. Dokumen ini bertujuan untuk memberikan beberapa metode darurat untuk membantu Anda pulih dari perangkat &quot;bricked&quot;.</p><h2 id="brick-saat-memflash-partisi-boot" tabindex="-1">Brick saat memflash partisi boot <a class="header-anchor" href="#brick-saat-memflash-partisi-boot" aria-label="Permalink to &quot;Brick saat memflash partisi boot&quot;">​</a></h2><p>Di KernelSU, situasi berikut dapat menyebabkan bata boot saat mem-flash partisi boot:</p><ol><li>Anda mem-flash image boot dalam format yang salah. Misalnya, jika format booting ponsel Anda adalah <code>gz</code>, tetapi Anda mem-flash image berformat <code>lz4</code>, maka ponsel tidak akan dapat melakukan booting.</li><li>Ponsel Anda perlu menonaktifkan verifikasi AVB agar dapat boot dengan benar (biasanya perlu menghapus semua data di ponsel).</li><li>Kernel Anda memiliki beberapa bug atau tidak cocok untuk flash ponsel Anda.</li></ol><p>Apa pun situasinya, Anda dapat memulihkannya dengan <strong>mem-flash gambar boot stok</strong>. Oleh karena itu, di awal tutorial instalasi, kami sangat menyarankan Anda untuk mem-backup stock boot Anda sebelum melakukan flashing. Jika Anda belum mencadangkan, Anda dapat memperoleh boot pabrik asli dari pengguna lain dengan perangkat yang sama dengan Anda atau dari firmware resmi.</p><h2 id="brick-disebabkan-modul" tabindex="-1">Brick disebabkan modul <a class="header-anchor" href="#brick-disebabkan-modul" aria-label="Permalink to &quot;Brick disebabkan modul&quot;">​</a></h2><p>Memasang modul dapat menjadi penyebab yang lebih umum dari bricking perangkat Anda, tetapi kami harus memperingatkan Anda dengan serius: <strong>Jangan memasang modul dari sumber yang tidak dikenal</strong>! Karena modul memiliki hak akses root, mereka berpotensi menyebabkan kerusakan permanen pada perangkat Anda!</p><h3 id="module-normal" tabindex="-1">Module normal <a class="header-anchor" href="#module-normal" aria-label="Permalink to &quot;Module normal&quot;">​</a></h3><p>Jika Anda telah mem-flash modul yang telah terbukti aman tetapi menyebabkan perangkat Anda gagal booting, maka situasi ini dapat dipulihkan dengan mudah di KernelSU tanpa rasa khawatir. KernelSU memiliki mekanisme bawaan untuk menyelamatkan perangkat Anda, termasuk yang berikut:</p><ol><li>Pembaruan AB</li><li>Selamatkan dengan menekan Volume Turun</li></ol><h4 id="pembaruan-ab" tabindex="-1">Pembaruan AB <a class="header-anchor" href="#pembaruan-ab" aria-label="Permalink to &quot;Pembaruan AB&quot;">​</a></h4><p>Pembaruan modul KernelSU menarik inspirasi dari mekanisme pembaruan AB sistem Android yang digunakan dalam pembaruan OTA. Jika Anda menginstal modul baru atau memperbarui modul yang sudah ada, itu tidak akan langsung mengubah file modul yang sedang digunakan. Sebagai gantinya, semua modul akan dibangun ke gambar pembaruan lainnya. Setelah sistem dimulai ulang, sistem akan mencoba untuk mulai menggunakan gambar pembaruan ini. Jika sistem Android berhasil melakukan booting, modul akan benar-benar diperbarui.</p><p>Oleh karena itu, metode paling sederhana dan paling umum digunakan untuk menyelamatkan perangkat Anda adalah dengan <strong>memaksa reboot</strong>. Jika Anda tidak dapat memulai sistem Anda setelah mem-flash modul, Anda dapat menekan dan menahan tombol daya selama lebih dari 10 detik, dan sistem akan melakukan reboot secara otomatis; setelah mem-boot ulang, itu akan kembali ke keadaan sebelum memperbarui modul, dan modul yang diperbarui sebelumnya akan dinonaktifkan secara otomatis.</p><h4 id="recovery-dengan-menekan-volume-bawah" tabindex="-1">Recovery dengan menekan Volume Bawah <a class="header-anchor" href="#recovery-dengan-menekan-volume-bawah" aria-label="Permalink to &quot;Recovery dengan menekan Volume Bawah&quot;">​</a></h4><p>Jika pembaruan AB masih tidak dapat menyelesaikan masalah, Anda dapat mencoba menggunakan <strong>Safe Mode</strong>. Dalam Safe Mode, semua modul dinonaktifkan.</p><p>Ada dua cara untuk masuk ke Safe Mode:</p><ol><li>Mode Aman bawaan dari beberapa sistem; beberapa sistem memiliki Safe Mode bawaan yang dapat diakses dengan menekan lama tombol volume turun, sementara yang lain (seperti MIUI) dapat mengaktifkan Safe Mode di Recovery. Saat memasuki Safe Mode sistem, KernelSU juga akan masuk ke Safe Mode dan secara otomatis menonaktifkan modul.</li><li>Safe Mode bawaan dari KernelSU; metode pengoperasiannya adalah <strong>tekan tombol volume turun secara terus-menerus selama lebih dari tiga kali</strong> setelah layar boot pertama. Perhatikan bahwa ini adalah rilis pers, rilis pers, rilis pers, bukan tekan dan tahan.</li></ol><p>Setelah memasuki mode aman, semua modul pada halaman modul KernelSU Manager dinonaktifkan, tetapi Anda dapat melakukan operasi &quot;uninstall&quot; untuk menghapus semua modul yang mungkin menyebabkan masalah.</p><p>Mode aman bawaan diimplementasikan di kernel, jadi tidak ada kemungkinan peristiwa penting yang hilang karena intersepsi. Namun, untuk kernel non-GKI, integrasi kode secara manual mungkin diperlukan, dan Anda dapat merujuk ke dokumentasi resmi untuk mendapatkan panduan.</p><h3 id="module-berbahaya" tabindex="-1">Module berbahaya <a class="header-anchor" href="#module-berbahaya" aria-label="Permalink to &quot;Module berbahaya&quot;">​</a></h3><p>Jika metode di atas tidak dapat menyelamatkan perangkat Anda, kemungkinan besar modul yang Anda instal memiliki operasi jahat atau telah merusak perangkat Anda melalui cara lain. Dalam hal ini, hanya ada dua saran:</p><ol><li>Hapus data dan flash sistem resmi.</li><li>Konsultasikan layanan purna jual.</li></ol>',23),o=[m];function r(d,l,u,s,k,b){return e(),n("div",null,o)}const h=a(t,[["render",r]]);export{g as __pageData,h as default};
