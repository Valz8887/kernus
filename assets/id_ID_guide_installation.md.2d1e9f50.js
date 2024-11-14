import{_ as a,o as e,c as n,Q as t}from"./chunks/framework.ec8f7e8e.js";const g=JSON.parse('{"title":"Instalasi","description":"","frontmatter":{},"headers":[],"relativePath":"id_ID/guide/installation.md","filePath":"id_ID/guide/installation.md"}'),o={name:"id_ID/guide/installation.md"},s=t('<h1 id="instalasi" tabindex="-1">Instalasi <a class="header-anchor" href="#instalasi" aria-label="Permalink to &quot;Instalasi&quot;">​</a></h1><h2 id="periksa-apakah-perangkat-anda-didukung" tabindex="-1">Periksa apakah perangkat Anda didukung <a class="header-anchor" href="#periksa-apakah-perangkat-anda-didukung" aria-label="Permalink to &quot;Periksa apakah perangkat Anda didukung&quot;">​</a></h2><p>Unduh aplikasi manajer KernelSU dari <a href="https://github.com/tiann/KernelSU/releases" target="_blank" rel="noreferrer">github releases</a> atau <a href="https://github.com/tiann/KernelSU/actions/workflows/build-manager.yml" target="_blank" rel="noreferrer">github actions</a>, lalu instal aplikasi ke perangkat dan buka aplikasi:</p><ul><li>Jika aplikasi menunjukkan <code>Unsupported</code>, itu berarti <strong>Anda harus mengkompilasi kernel sendiri</strong>, KernelSU tidak akan dan tidak pernah menyediakan boot image untuk Anda flash.</li><li>Jika aplikasi menunjukkan <code>Not installed</code>, maka perangkat Anda secara resmi didukung oleh KernelSU.</li></ul><h2 id="temukan-boot-img-yang-tepat" tabindex="-1">Temukan boot.img yang tepat <a class="header-anchor" href="#temukan-boot-img-yang-tepat" aria-label="Permalink to &quot;Temukan boot.img yang tepat&quot;">​</a></h2><p>KernelSU menyediakan boot.img umum untuk perangkat GKI, Anda harus mem-flash boot.img ke partisi boot perangkat Anda.</p><p>Anda dapat mengunduh boot.img dari [github actions for kernel] (<a href="https://github.com/tiann/KernelSU/actions/workflows/build-kernel.yml" target="_blank" rel="noreferrer">https://github.com/tiann/KernelSU/actions/workflows/build-kernel.yml</a>), perlu diketahui bahwa Anda harus menggunakan versi boot.img yang tepat. Sebagai contoh, jika perangkat Anda menunjukkan bahwa kernelnya adalah <code>5.10.101</code>, maka Anda harus mengunduh <code>5.10.101-xxxx.boot.xxx</code>.</p><p>Dan juga, silakan periksa format boot.img Anda, Anda harus menggunakan format yang tepat, seperti <code>lz4</code>、<code>gz</code>.</p><h2 id="flash-boot-img-ke-perangkat" tabindex="-1">Flash boot.img ke perangkat <a class="header-anchor" href="#flash-boot-img-ke-perangkat" aria-label="Permalink to &quot;Flash boot.img ke perangkat&quot;">​</a></h2><p>Hubungkan perangkat Anda dengan <code>adb</code> lalu jalankan <code>adb reboot bootloader</code> untuk masuk ke mode fastboot, lalu gunakan perintah ini untuk mem-flash KernelSU:</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#B392F0;">fastboot</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">flash</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">boot</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">boot.img</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6F42C1;">fastboot</span><span style="color:#24292E;"> </span><span style="color:#032F62;">flash</span><span style="color:#24292E;"> </span><span style="color:#032F62;">boot</span><span style="color:#24292E;"> </span><span style="color:#032F62;">boot.img</span></span></code></pre></div><h2 id="reboot" tabindex="-1">Reboot <a class="header-anchor" href="#reboot" aria-label="Permalink to &quot;Reboot&quot;">​</a></h2><p>Ketika di-flash, Anda harus menyalakan ulang perangkat Anda:</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#B392F0;">fastboot</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">reboot</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6F42C1;">fastboot</span><span style="color:#24292E;"> </span><span style="color:#032F62;">reboot</span></span></code></pre></div>',14),l=[s];function i(r,p,d,c,k,u){return e(),n("div",null,l)}const b=a(o,[["render",i]]);export{g as __pageData,b as default};
