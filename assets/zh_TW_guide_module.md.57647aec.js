import{_ as s,o as e,c as n,Q as a}from"./chunks/framework.ec8f7e8e.js";const h=JSON.parse('{"title":"模組指南","description":"","frontmatter":{},"headers":[],"relativePath":"zh_TW/guide/module.md","filePath":"zh_TW/guide/module.md"}'),l={name:"zh_TW/guide/module.md"},o=a(`<h1 id="introduction" tabindex="-1">模組指南 <a class="header-anchor" href="#introduction" aria-label="Permalink to &quot;模組指南 {#introduction}&quot;">​</a></h1><p>KernelSU 提供了一個模組機制，它可以在保持系統分割區完整性的同時達到修改系統分割區的效果；這種機制一般被稱為 systemless。</p><p>KernelSU 的模組運作機制與 Magisk 幾乎相同，如果您熟悉 Magisk 模組的開發，那麼開發 KernelSU 的模組大同小異，您可以跳過下列有關模組的介紹，只需要瞭解 <a href="./difference-with-magisk.html">KernelSU 模組與 Magisk 模組的異同</a>。</p><h2 id="busybox" tabindex="-1">Busybox <a class="header-anchor" href="#busybox" aria-label="Permalink to &quot;Busybox&quot;">​</a></h2><p>KernelSU 提供了一個完備的 BusyBox 二進位檔案 (包括完整的 SELinux 支援)。可執行檔位於 <code>/data/adb/ksu/bin/busybox</code>。 KernelSU 的 BusyBox 支援同時執行時可切換的 &quot;ASH Standalone Shell Mode&quot;。 這種讀了模式意味著在執行 BusyBox 的 ash shell 時，每個命令都會直接使用 BusyBox 中內建的應用程式，而不論 PATH 的設定為何。 例如，<code>ls</code>、<code>rm</code>、<code>chmod</code> 等命令將不會使用 PATH 中設定的命令 (在 Android 的狀況下，預設狀況下分別為 <code>/system/bin/ls</code>、<code>/system/bin/rm</code> 和 <code>/system/bin/chmod</code>)，而是直接呼叫 BusyBox 內建的應用程式。 這確保了指令碼始終在可預測的環境中執行，並始終具有完整的命令套件，不論它執行在哪個 Android 版本上。 要強制下一個命令不使用 BusyBox，您必須使用完整路徑呼叫可執行檔。</p><p>在 KernelSU 上下文中執行的每個 shell 指令碼都將在 BusyBox 的 ash shell 中以獨立模式執行。對於第三方開發人員相關的內容，包括所有開機指令碼和模組安裝指令碼。</p><p>對於想要在 KernelSU 之外使用這個「獨立模式」功能的使用者，有兩種啟用方法：</p><ol><li>將環境變數 <code>ASH_STANDALONE</code> 設為 <code>1</code>。例如：<code>ASH_STANDALONE=1 /data/adb/ksu/bin/busybox sh &lt;script&gt;</code></li><li>使用命令列選項切換：<code>/data/adb/ksu/bin/busybox sh -o standalone &lt;script&gt;</code></li></ol><p>為了確保所有後續的 <code>sh</code> shell 都在獨立模式下執行，第一種是首選方法 (這也是 KernelSU 和 KernelSU 管理員內部使用的方法)，因為環境變數會被繼承到子處理程序中。</p><div class="tip custom-block"><p class="custom-block-title">與 Magisk 的差異</p><p>KernelSU 的 BusyBox 現在是直接使用 Magisk 專案編譯的二進位檔案，<strong>感謝 Magisk！</strong> 因此，您完全不必擔心 BusyBox 指令碼與在 Magisk 和 KernelSU 之間的相容性問題，因為它們完全相同！</p></div><h2 id="kernelsu-modules" tabindex="-1">KernelSU 模組 <a class="header-anchor" href="#kernelsu-modules" aria-label="Permalink to &quot;KernelSU 模組 {#kernelsu-modules}&quot;">​</a></h2><p>KernelSU 模組是一個放置於 <code>/data/adb/modules</code> 且滿足下列結構的資料夾：</p><div class="language-txt vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">txt</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">/data/adb/modules</span></span>
<span class="line"><span style="color:#e1e4e8;">├── .</span></span>
<span class="line"><span style="color:#e1e4e8;">├── .</span></span>
<span class="line"><span style="color:#e1e4e8;">|</span></span>
<span class="line"><span style="color:#e1e4e8;">├── $MODID                  &lt;--- 模組的資料夾名稱與模組 ID 相同</span></span>
<span class="line"><span style="color:#e1e4e8;">│   │</span></span>
<span class="line"><span style="color:#e1e4e8;">│   │      *** 模組識別 ***</span></span>
<span class="line"><span style="color:#e1e4e8;">│   │</span></span>
<span class="line"><span style="color:#e1e4e8;">│   ├── module.prop         &lt;--- 這個檔案儲存與模組相關的中繼資料，例如模組 ID、版本等</span></span>
<span class="line"><span style="color:#e1e4e8;">│   │</span></span>
<span class="line"><span style="color:#e1e4e8;">│   │      *** 主要內容 ***</span></span>
<span class="line"><span style="color:#e1e4e8;">│   │</span></span>
<span class="line"><span style="color:#e1e4e8;">│   ├── system              &lt;--- 這個資料夾會在 skip_mount 不存在時被掛接至系統</span></span>
<span class="line"><span style="color:#e1e4e8;">│   │   ├── ...</span></span>
<span class="line"><span style="color:#e1e4e8;">│   │   ├── ...</span></span>
<span class="line"><span style="color:#e1e4e8;">│   │   └── ...</span></span>
<span class="line"><span style="color:#e1e4e8;">│   │</span></span>
<span class="line"><span style="color:#e1e4e8;">│   │      *** 狀態旗標 ***</span></span>
<span class="line"><span style="color:#e1e4e8;">│   │</span></span>
<span class="line"><span style="color:#e1e4e8;">│   ├── skip_mount          &lt;--- 如果這個檔案存在，那麼 KernelSU 將不會掛接您的系統資料夾</span></span>
<span class="line"><span style="color:#e1e4e8;">│   ├── disable             &lt;--- 如果這個檔案存在，那麼模組將會被停用</span></span>
<span class="line"><span style="color:#e1e4e8;">│   ├── remove              &lt;--- 如果這個檔案存在，那麼模組將會在下次重新開機時被移除</span></span>
<span class="line"><span style="color:#e1e4e8;">│   │</span></span>
<span class="line"><span style="color:#e1e4e8;">│   │      *** 選用檔案 ***</span></span>
<span class="line"><span style="color:#e1e4e8;">│   │</span></span>
<span class="line"><span style="color:#e1e4e8;">│   ├── post-fs-data.sh     &lt;--- 這個指令碼將會在 post-fs-data 中執行</span></span>
<span class="line"><span style="color:#e1e4e8;">│   ├── service.sh          &lt;--- 這個指令碼將會在 late_start 服務中執行</span></span>
<span class="line"><span style="color:#e1e4e8;">|   ├── uninstall.sh        &lt;--- 這個指令碼將會在 KernelSU 移除模組時執行</span></span>
<span class="line"><span style="color:#e1e4e8;">│   ├── system.prop         &lt;--- 這個檔案中指定的屬性將會在系統啟動時透過 resetprop 變更</span></span>
<span class="line"><span style="color:#e1e4e8;">│   ├── sepolicy.rule       &lt;--- 這個檔案中的 SELinux 原則將會在系統開機時載入</span></span>
<span class="line"><span style="color:#e1e4e8;">│   │</span></span>
<span class="line"><span style="color:#e1e4e8;">│   │      *** 自動產生的目錄，不要手動建立或修改！ ***</span></span>
<span class="line"><span style="color:#e1e4e8;">│   │</span></span>
<span class="line"><span style="color:#e1e4e8;">│   ├── vendor              &lt;--- A symlink to $MODID/system/vendor</span></span>
<span class="line"><span style="color:#e1e4e8;">│   ├── product             &lt;--- A symlink to $MODID/system/product</span></span>
<span class="line"><span style="color:#e1e4e8;">│   ├── system_ext          &lt;--- A symlink to $MODID/system/system_ext</span></span>
<span class="line"><span style="color:#e1e4e8;">│   │</span></span>
<span class="line"><span style="color:#e1e4e8;">│   │      *** 允許的其他額外檔案/資料夾 ***</span></span>
<span class="line"><span style="color:#e1e4e8;">│   │</span></span>
<span class="line"><span style="color:#e1e4e8;">│   ├── ...</span></span>
<span class="line"><span style="color:#e1e4e8;">│   └── ...</span></span>
<span class="line"><span style="color:#e1e4e8;">|</span></span>
<span class="line"><span style="color:#e1e4e8;">├── another_module</span></span>
<span class="line"><span style="color:#e1e4e8;">│   ├── .</span></span>
<span class="line"><span style="color:#e1e4e8;">│   └── .</span></span>
<span class="line"><span style="color:#e1e4e8;">├── .</span></span>
<span class="line"><span style="color:#e1e4e8;">├── .</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">/data/adb/modules</span></span>
<span class="line"><span style="color:#24292e;">├── .</span></span>
<span class="line"><span style="color:#24292e;">├── .</span></span>
<span class="line"><span style="color:#24292e;">|</span></span>
<span class="line"><span style="color:#24292e;">├── $MODID                  &lt;--- 模組的資料夾名稱與模組 ID 相同</span></span>
<span class="line"><span style="color:#24292e;">│   │</span></span>
<span class="line"><span style="color:#24292e;">│   │      *** 模組識別 ***</span></span>
<span class="line"><span style="color:#24292e;">│   │</span></span>
<span class="line"><span style="color:#24292e;">│   ├── module.prop         &lt;--- 這個檔案儲存與模組相關的中繼資料，例如模組 ID、版本等</span></span>
<span class="line"><span style="color:#24292e;">│   │</span></span>
<span class="line"><span style="color:#24292e;">│   │      *** 主要內容 ***</span></span>
<span class="line"><span style="color:#24292e;">│   │</span></span>
<span class="line"><span style="color:#24292e;">│   ├── system              &lt;--- 這個資料夾會在 skip_mount 不存在時被掛接至系統</span></span>
<span class="line"><span style="color:#24292e;">│   │   ├── ...</span></span>
<span class="line"><span style="color:#24292e;">│   │   ├── ...</span></span>
<span class="line"><span style="color:#24292e;">│   │   └── ...</span></span>
<span class="line"><span style="color:#24292e;">│   │</span></span>
<span class="line"><span style="color:#24292e;">│   │      *** 狀態旗標 ***</span></span>
<span class="line"><span style="color:#24292e;">│   │</span></span>
<span class="line"><span style="color:#24292e;">│   ├── skip_mount          &lt;--- 如果這個檔案存在，那麼 KernelSU 將不會掛接您的系統資料夾</span></span>
<span class="line"><span style="color:#24292e;">│   ├── disable             &lt;--- 如果這個檔案存在，那麼模組將會被停用</span></span>
<span class="line"><span style="color:#24292e;">│   ├── remove              &lt;--- 如果這個檔案存在，那麼模組將會在下次重新開機時被移除</span></span>
<span class="line"><span style="color:#24292e;">│   │</span></span>
<span class="line"><span style="color:#24292e;">│   │      *** 選用檔案 ***</span></span>
<span class="line"><span style="color:#24292e;">│   │</span></span>
<span class="line"><span style="color:#24292e;">│   ├── post-fs-data.sh     &lt;--- 這個指令碼將會在 post-fs-data 中執行</span></span>
<span class="line"><span style="color:#24292e;">│   ├── service.sh          &lt;--- 這個指令碼將會在 late_start 服務中執行</span></span>
<span class="line"><span style="color:#24292e;">|   ├── uninstall.sh        &lt;--- 這個指令碼將會在 KernelSU 移除模組時執行</span></span>
<span class="line"><span style="color:#24292e;">│   ├── system.prop         &lt;--- 這個檔案中指定的屬性將會在系統啟動時透過 resetprop 變更</span></span>
<span class="line"><span style="color:#24292e;">│   ├── sepolicy.rule       &lt;--- 這個檔案中的 SELinux 原則將會在系統開機時載入</span></span>
<span class="line"><span style="color:#24292e;">│   │</span></span>
<span class="line"><span style="color:#24292e;">│   │      *** 自動產生的目錄，不要手動建立或修改！ ***</span></span>
<span class="line"><span style="color:#24292e;">│   │</span></span>
<span class="line"><span style="color:#24292e;">│   ├── vendor              &lt;--- A symlink to $MODID/system/vendor</span></span>
<span class="line"><span style="color:#24292e;">│   ├── product             &lt;--- A symlink to $MODID/system/product</span></span>
<span class="line"><span style="color:#24292e;">│   ├── system_ext          &lt;--- A symlink to $MODID/system/system_ext</span></span>
<span class="line"><span style="color:#24292e;">│   │</span></span>
<span class="line"><span style="color:#24292e;">│   │      *** 允許的其他額外檔案/資料夾 ***</span></span>
<span class="line"><span style="color:#24292e;">│   │</span></span>
<span class="line"><span style="color:#24292e;">│   ├── ...</span></span>
<span class="line"><span style="color:#24292e;">│   └── ...</span></span>
<span class="line"><span style="color:#24292e;">|</span></span>
<span class="line"><span style="color:#24292e;">├── another_module</span></span>
<span class="line"><span style="color:#24292e;">│   ├── .</span></span>
<span class="line"><span style="color:#24292e;">│   └── .</span></span>
<span class="line"><span style="color:#24292e;">├── .</span></span>
<span class="line"><span style="color:#24292e;">├── .</span></span></code></pre></div><div class="tip custom-block"><p class="custom-block-title">與 Magisk 的差異</p><p>KernelSU 沒有內建的針對 Zygisk 的支援，因此模組中沒有與 Zygisk 相關的內容，但您可以透過 <a href="https://github.com/Dr-TSNG/ZygiskNext" target="_blank" rel="noreferrer">ZygiskNext</a> 以支援 Zygisk 模組，此時 Zygisk 模組的內容與 Magisk 所支援的 Zygisk 完全相同。</p></div><h3 id="module-prop" tabindex="-1">module.prop <a class="header-anchor" href="#module-prop" aria-label="Permalink to &quot;module.prop&quot;">​</a></h3><p>module.prop 是一個模組的組態檔案，在 KernelSU 中如果模組中不包含這個檔案，那麼它將不被認為是一個模組；這個檔案的格式如下：</p><div class="language-txt vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">txt</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">id=&lt;string&gt;</span></span>
<span class="line"><span style="color:#e1e4e8;">name=&lt;string&gt;</span></span>
<span class="line"><span style="color:#e1e4e8;">version=&lt;string&gt;</span></span>
<span class="line"><span style="color:#e1e4e8;">versionCode=&lt;int&gt;</span></span>
<span class="line"><span style="color:#e1e4e8;">author=&lt;string&gt;</span></span>
<span class="line"><span style="color:#e1e4e8;">description=&lt;string&gt;</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">id=&lt;string&gt;</span></span>
<span class="line"><span style="color:#24292e;">name=&lt;string&gt;</span></span>
<span class="line"><span style="color:#24292e;">version=&lt;string&gt;</span></span>
<span class="line"><span style="color:#24292e;">versionCode=&lt;int&gt;</span></span>
<span class="line"><span style="color:#24292e;">author=&lt;string&gt;</span></span>
<span class="line"><span style="color:#24292e;">description=&lt;string&gt;</span></span></code></pre></div><ul><li>id 必須與這個規則運算式相符：<code>^[a-zA-Z][a-zA-Z0-9._-]+$</code> 例如：✓ <code>a_module</code>，✓ <code>a.module</code>，✓ <code>module-101</code>，✗ <code>a module</code>，✗ <code>1_module</code>，✗ <code>-a-module</code>。這是您的模組的唯一識別碼，發表後將無法變更。</li><li>versionCode 必須是一個整數，用於比較版本。</li><li>其他未在上方提到的內容可以是任何單行字串。</li><li>請確保使用 <code>UNIX (LF)</code> 分行符號類型，而非 <code>Windows (CR + LF)</code> 或 <code>Macintosh (CR)</code>。</li></ul><h3 id="shell-scripts" tabindex="-1">Shell 指令碼 <a class="header-anchor" href="#shell-scripts" aria-label="Permalink to &quot;Shell 指令碼 {#shell-scripts}&quot;">​</a></h3><p>請閱讀 <a href="#boot-scripts">開機指令碼</a> 章節，以瞭解 <code>post-fs-data.sh</code> 和 <code>service.sh</code> 之間的差別。對於大多數模組開發人員來說，如果您只需要執行一個開機指令碼，<code>service.sh</code> 應該已經足夠了。</p><p>在您的模組中的所有指令碼中，請使用 <code>MODDIR=\${0%/*}</code> 以取得您的模組基本目錄路徑；請不要在指令碼中以硬式編碼的方式加入您的模組路徑。</p><div class="tip custom-block"><p class="custom-block-title">與 Magisk 的差異</p><p>您可以透過環境變數 <code>KSU</code> 來判斷指令碼是執行在 KernelSU 還是 Magisk 中，如果執行在 KernelSU，這個值會被設為 <code>true</code>。</p></div><h3 id="system-directories" tabindex="-1"><code>system</code> 目錄 <a class="header-anchor" href="#system-directories" aria-label="Permalink to &quot;\`system\` 目錄 {#system-directories}&quot;">​</a></h3><p>這個目錄的內容會在系統啟動後，以 <code>overlayfs</code> 的方式覆疊在系統的 <code>/system</code> 分割區之上，這表示：</p><ol><li>系統中對應目錄的相同名稱的檔案會被此目錄中的檔案覆寫。</li><li>系統中對應目錄的相同名稱的檔案會與此目錄的檔案合併。</li></ol><p>如果您想要刪除系統先前的目錄中的某個檔案或資料夾，您需要在模組目錄中透過 <code>mknod filename c 0 0</code> 以建立一個 <code>filename</code> 的相同名稱的檔案；這樣 overlayfs 系統會自動「whiteout」等效刪除這個檔案 (<code>/system</code> 分割區並未被變更)。</p><p>您也可以在 <code>customize.sh</code> 中宣告一個名為 <code>REMOVE</code> 並且包含一系列目錄的變數以執行移除作業，KernelSU 會自動為您在模組對應目錄執行 <code>mknod &lt;TARGET&gt; c 0 0</code>。例如：</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">REMOVE</span><span style="color:#F97583;">=</span><span style="color:#9ECBFF;">&quot;</span></span>
<span class="line"><span style="color:#9ECBFF;">/system/app/YouTube</span></span>
<span class="line"><span style="color:#9ECBFF;">/system/app/Bloatware</span></span>
<span class="line"><span style="color:#9ECBFF;">&quot;</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">REMOVE</span><span style="color:#D73A49;">=</span><span style="color:#032F62;">&quot;</span></span>
<span class="line"><span style="color:#032F62;">/system/app/YouTube</span></span>
<span class="line"><span style="color:#032F62;">/system/app/Bloatware</span></span>
<span class="line"><span style="color:#032F62;">&quot;</span></span></code></pre></div><p>上方的清單將會執行：<code>mknod $MODPATH/system/app/YouTuBe c 0 0</code> 和 <code>mknod $MODPATH/system/app/Bloatware c 0 0</code>；並且 <code>/system/app/YouTube</code> 和 <code>/system/app/Bloatware</code> 將會在模組生效前移除。</p><p>如果您想要取代系統的某個目錄，您需要在模組目錄中建立一個相同路徑的目錄，然後為此目錄設定此屬性：<code>setfattr -n trusted.overlay.opaque -v y &lt;TARGET&gt;</code>；這樣 overlayfs 系統會自動將對應目錄取代 (<code>/system</code> 分割區並未被變更)。</p><p>您可以在 <code>customize.sh</code> 中宣告一個名為 <code>REMOVE</code> 並且包含一系列目錄的變數以執行移除作業，KernelSU 會自動為您在模組對應目錄執行相關作業。例如：</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">REPLACE</span><span style="color:#F97583;">=</span><span style="color:#9ECBFF;">&quot;</span></span>
<span class="line"><span style="color:#9ECBFF;">/system/app/YouTube</span></span>
<span class="line"><span style="color:#9ECBFF;">/system/app/Bloatware</span></span>
<span class="line"><span style="color:#9ECBFF;">&quot;</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">REPLACE</span><span style="color:#D73A49;">=</span><span style="color:#032F62;">&quot;</span></span>
<span class="line"><span style="color:#032F62;">/system/app/YouTube</span></span>
<span class="line"><span style="color:#032F62;">/system/app/Bloatware</span></span>
<span class="line"><span style="color:#032F62;">&quot;</span></span></code></pre></div><p>上方的清單將會執行：自動建立目錄 <code>$MODPATH/system/app/YouTube</code> 和 <code>$MODPATH//system/app/Bloatware</code>，然後執行 <code>setfattr -n trusted.overlay.opaque -v y $$MODPATH/system/app/YouTube</code> 和 <code>setfattr -n trusted.overlay.opaque -v y $$MODPATH/system/app/Bloatware</code>；並且 <code>/system/app/YouTube</code> 和 <code>/system/app/Bloatware</code> 將會在模組生效後被取代為空白目錄。</p><div class="tip custom-block"><p class="custom-block-title">與 Magisk 的差異</p><p>KernelSU 的 systemless 機制透過核心的 overlayfs 實作，而 Magisk 目前則是透過 magic mount (bind mount)，兩者的實作方式有很大的差別，但最終的目標是一致的：不修改實際的 <code>/system</code> 分割區但修改 <code>/system</code> 檔案。</p></div><p>如果您對 overlayfs 感興趣，建議閱讀 Linux Kernel 關於 <a href="https://docs.kernel.org/filesystems/overlayfs.html" target="_blank" rel="noreferrer">overlayfs 的文件</a></p><h3 id="system-prop" tabindex="-1">system.prop <a class="header-anchor" href="#system-prop" aria-label="Permalink to &quot;system.prop&quot;">​</a></h3><p>這個檔案的格式與 <code>build.prop</code> 完全相同：每一行都是由 <code>[key]=[value]</code> 組成。</p><h3 id="sepolicy-rule" tabindex="-1">sepolicy.rule <a class="header-anchor" href="#sepolicy-rule" aria-label="Permalink to &quot;sepolicy.rule&quot;">​</a></h3><p>如果您的模組需要一些額外 SELinux 原則修補程式，請將這些原則新增至這個檔案中。這個檔案的每一行都將被視為一個原則陳述。</p><h2 id="module-installer" tabindex="-1">模組安裝程式 <a class="header-anchor" href="#module-installer" aria-label="Permalink to &quot;模組安裝程式 {#module-installer}&quot;">​</a></h2><p>KernelSU 的模組安裝程式就是一個可以透過 KernelSU 管理員應用程式刷新的 Zip 檔案，這個 Zip 檔案的格式如下：</p><div class="language-txt vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">txt</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">module.zip</span></span>
<span class="line"><span style="color:#e1e4e8;">│</span></span>
<span class="line"><span style="color:#e1e4e8;">├── customize.sh                       &lt;--- (Optional, more details later)</span></span>
<span class="line"><span style="color:#e1e4e8;">│                                           This script will be sourced by update-binary</span></span>
<span class="line"><span style="color:#e1e4e8;">├── ...</span></span>
<span class="line"><span style="color:#e1e4e8;">├── ...  /* 其他模块文件 */</span></span>
<span class="line"><span style="color:#e1e4e8;">│</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">module.zip</span></span>
<span class="line"><span style="color:#24292e;">│</span></span>
<span class="line"><span style="color:#24292e;">├── customize.sh                       &lt;--- (Optional, more details later)</span></span>
<span class="line"><span style="color:#24292e;">│                                           This script will be sourced by update-binary</span></span>
<span class="line"><span style="color:#24292e;">├── ...</span></span>
<span class="line"><span style="color:#24292e;">├── ...  /* 其他模块文件 */</span></span>
<span class="line"><span style="color:#24292e;">│</span></span></code></pre></div><div class="warning custom-block"><p class="custom-block-title">WARNING</p><p>KernelSU 模組不支援在 Recovery 中安裝！！</p></div><h3 id="customizing-installation" tabindex="-1">自訂安裝程序 <a class="header-anchor" href="#customizing-installation" aria-label="Permalink to &quot;自訂安裝程序 {#customizing-installation}&quot;">​</a></h3><p>如果您想要控制模組的安裝程序，可以在模組的目錄下建立一個名為 <code>customize.sh</code> 的檔案，這個檔案將會在模組被解壓縮後<strong>匯入</strong>至目前的 shell 中，如果您的模組需要依據裝置的 API 版本或裝置架構執行一些額外的作業，這個指令碼將非常有用。</p><p>如果您想完全控制指令碼的安裝程序，您可以在 <code>customize.sh</code> 中宣告 <code>SKIPUNZIP=1</code> 以跳過所有的預設安裝步驟；此時，您需要自行處理所有的安裝程序 (例如解壓縮模組、設定權限等)</p><p><code>customize.sh</code> 指令碼以「獨立模式」執行在 KernelSU 的 BusyBox <code>ash</code> shell 中。您可以使用下列變數和函式：</p><h4 id="variables" tabindex="-1">變數 <a class="header-anchor" href="#variables" aria-label="Permalink to &quot;變數 {#variables}&quot;">​</a></h4><ul><li><code>KSU</code> (bool): 標示此指令碼執行於 KernelSU 環境中，此變數的值將永遠為 <code>true</code>，您可以透過它與 Magisk 進行區分。</li><li><code>KSU_VER</code> (string): KernelSU 目前的版本名稱 (例如 <code>v0.4.0</code>)</li><li><code>KSU_VER_CODE</code> (int): KernelSU 使用者空間目前的版本代碼 (例如 <code>10672</code>)</li><li><code>KSU_KERNEL_VER_CODE</code> (int): KernelSU 核心空間目前的版本代碼 (例如 <code>10672</code>)</li><li><code>BOOTMODE</code> (bool): 此變數在 KernelSU 中永遠為 <code>true</code></li><li><code>MODPATH</code> (path): 目前模組的安裝目錄</li><li><code>TMPDIR</code> (path): 可以存放暫存檔的位置</li><li><code>ZIPFILE</code> (path): 目前模組的安裝程式 Zip</li><li><code>ARCH</code> (string): 裝置的 CPU 架構，有這幾種：<code>arm</code>, <code>arm64</code>, <code>x86</code>, or <code>x64</code></li><li><code>IS64BIT</code> (bool): 是否為 64 位元裝置</li><li><code>API</code> (int): 目前裝置的 Android API 版本 (例如 Android 6.0 上為 <code>23</code>)</li></ul><div class="warning custom-block"><p class="custom-block-title">WARNING</p><p><code>MAGISK_VER_CODE</code> 在 KernelSU 永遠為 <code>25200</code>，<code>MAGISK_VER</code> 則為 <code>v25.2</code>，請不要透過這兩個變數來判斷是否為 KernelSU！</p></div><h4 id="functions" tabindex="-1">函式 <a class="header-anchor" href="#functions" aria-label="Permalink to &quot;函式 {#functions}&quot;">​</a></h4><div class="language-txt vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">txt</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">ui_print &lt;msg&gt;</span></span>
<span class="line"><span style="color:#e1e4e8;">    print &lt;msg&gt; to console</span></span>
<span class="line"><span style="color:#e1e4e8;">    Avoid using &#39;echo&#39; as it will not display in custom recovery&#39;s console</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">abort &lt;msg&gt;</span></span>
<span class="line"><span style="color:#e1e4e8;">    print error message &lt;msg&gt; to console and terminate the installation</span></span>
<span class="line"><span style="color:#e1e4e8;">    Avoid using &#39;exit&#39; as it will skip the termination cleanup steps</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">set_perm &lt;target&gt; &lt;owner&gt; &lt;group&gt; &lt;permission&gt; [context]</span></span>
<span class="line"><span style="color:#e1e4e8;">    if [context] is not set, the default is &quot;u:object_r:system_file:s0&quot;</span></span>
<span class="line"><span style="color:#e1e4e8;">    this function is a shorthand for the following commands:</span></span>
<span class="line"><span style="color:#e1e4e8;">       chown owner.group target</span></span>
<span class="line"><span style="color:#e1e4e8;">       chmod permission target</span></span>
<span class="line"><span style="color:#e1e4e8;">       chcon context target</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">set_perm_recursive &lt;directory&gt; &lt;owner&gt; &lt;group&gt; &lt;dirpermission&gt; &lt;filepermission&gt; [context]</span></span>
<span class="line"><span style="color:#e1e4e8;">    if [context] is not set, the default is &quot;u:object_r:system_file:s0&quot;</span></span>
<span class="line"><span style="color:#e1e4e8;">    for all files in &lt;directory&gt;, it will call:</span></span>
<span class="line"><span style="color:#e1e4e8;">       set_perm file owner group filepermission context</span></span>
<span class="line"><span style="color:#e1e4e8;">    for all directories in &lt;directory&gt; (including itself), it will call:</span></span>
<span class="line"><span style="color:#e1e4e8;">       set_perm dir owner group dirpermission context</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">ui_print &lt;msg&gt;</span></span>
<span class="line"><span style="color:#24292e;">    print &lt;msg&gt; to console</span></span>
<span class="line"><span style="color:#24292e;">    Avoid using &#39;echo&#39; as it will not display in custom recovery&#39;s console</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">abort &lt;msg&gt;</span></span>
<span class="line"><span style="color:#24292e;">    print error message &lt;msg&gt; to console and terminate the installation</span></span>
<span class="line"><span style="color:#24292e;">    Avoid using &#39;exit&#39; as it will skip the termination cleanup steps</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">set_perm &lt;target&gt; &lt;owner&gt; &lt;group&gt; &lt;permission&gt; [context]</span></span>
<span class="line"><span style="color:#24292e;">    if [context] is not set, the default is &quot;u:object_r:system_file:s0&quot;</span></span>
<span class="line"><span style="color:#24292e;">    this function is a shorthand for the following commands:</span></span>
<span class="line"><span style="color:#24292e;">       chown owner.group target</span></span>
<span class="line"><span style="color:#24292e;">       chmod permission target</span></span>
<span class="line"><span style="color:#24292e;">       chcon context target</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">set_perm_recursive &lt;directory&gt; &lt;owner&gt; &lt;group&gt; &lt;dirpermission&gt; &lt;filepermission&gt; [context]</span></span>
<span class="line"><span style="color:#24292e;">    if [context] is not set, the default is &quot;u:object_r:system_file:s0&quot;</span></span>
<span class="line"><span style="color:#24292e;">    for all files in &lt;directory&gt;, it will call:</span></span>
<span class="line"><span style="color:#24292e;">       set_perm file owner group filepermission context</span></span>
<span class="line"><span style="color:#24292e;">    for all directories in &lt;directory&gt; (including itself), it will call:</span></span>
<span class="line"><span style="color:#24292e;">       set_perm dir owner group dirpermission context</span></span></code></pre></div><h2 id="boot-scripts" tabindex="-1">開機指令碼 <a class="header-anchor" href="#boot-scripts" aria-label="Permalink to &quot;開機指令碼 {#boot-scripts}&quot;">​</a></h2><p>在 KernelSU 中，依據指令碼執行模式的不同分為兩種：post-fs-data 模式和 late_start 服務模式。</p><ul><li><p>post-fs-data 模式</p><ul><li>這個階段是「封鎖」的。在執行完成之前或 10 秒鐘之後，開機程序會被暫停。</li><li>指令碼在任何模組被掛接之前執行。這使模組開發人員可以在模組被掛接之前動態調整他們的模組。</li><li>這個階段發生在 Zygote 啟動之前，這意味著 Android 中的一切。</li><li>使用 setprop 會導致開機程序死鎖！請使用 <code>resetprop -n &lt;prop_name&gt; &lt;prop_value&gt;</code> 替代。</li><li><strong>僅在必要時在此模式中執行指令碼</strong>。</li></ul></li><li><p>late_start 服務模式</p><ul><li>這個階段是「非封鎖」的。您的指令碼會與其餘的啟動程序<strong>平行</strong>執行。</li><li><strong>大多数脚本都建议在这种模式下运行</strong>。</li></ul></li></ul><p>在 KernelSU 中，開機指令碼依據存放位置的不同還分為兩種：一般指令碼和模組指令碼。</p><ul><li><p>一般指令碼</p><ul><li>放置於 <code>/data/adb/post-fs-data.d</code> 或 <code>/data/adb/service.d</code> 中。</li><li>僅有指令碼被設為可執行 (<code>chmod +x script.sh</code>) 時才會被執行。</li><li>在 <code>post-fs-data.d</code> 中的指令碼以 post-fs-data 模式執行，在 <code>service.d</code> 中的指令碼以 late_start 服務模式執行。</li><li>模組<strong>不應</strong>在安裝程序中新增一般指令碼。</li></ul></li><li><p>模組指令碼</p><ul><li>放置於模組自己的資料夾中。</li><li>僅有在模組啟用時才會執行。</li><li><code>post-fs-data.sh</code> 以 post-fs-data 模式執行，而 <code>service.sh</code> 則以 late_start 服務模式執行。</li></ul></li></ul><p>所有启动脚本都将在 KernelSU 的 BusyBox ash shell 中运行，并启用“独立模式”。</p>`,58),p=[o];function t(c,i,r,d,y,u){return e(),n("div",null,p)}const g=s(l,[["render",t]]);export{h as __pageData,g as default};
