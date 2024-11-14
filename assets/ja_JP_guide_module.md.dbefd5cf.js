import{_ as s,o as e,c as n,Q as a}from"./chunks/framework.ec8f7e8e.js";const g=JSON.parse('{"title":"モジュールのガイド","description":"","frontmatter":{},"headers":[],"relativePath":"ja_JP/guide/module.md","filePath":"ja_JP/guide/module.md"}'),l={name:"ja_JP/guide/module.md"},p=a(`<h1 id="モジュールのガイド" tabindex="-1">モジュールのガイド <a class="header-anchor" href="#モジュールのガイド" aria-label="Permalink to &quot;モジュールのガイド&quot;">​</a></h1><p>KernelSU はシステムパーティションの整合性を維持しながら、システムディレクトリを変更する効果を実現するモジュール機構を提供します。この機構は一般に「システムレス」と呼ばれています。</p><p>KernelSU のモジュール機構は、Magisk とほぼ同じです。Magisk のモジュール開発に慣れている方であれば、KernelSU のモジュール開発も簡単でしょう。その場合は以下のモジュールの紹介は読み飛ばして、<a href="./difference-with-magisk.html">Magisk との違い</a>の内容だけ読めばOKです。</p><h2 id="busybox" tabindex="-1">Busybox <a class="header-anchor" href="#busybox" aria-label="Permalink to &quot;Busybox&quot;">​</a></h2><p>KernelSU には、機能的に完全な Busybox バイナリ (SELinux の完全サポートを含む) が同梱されています。実行ファイルは <code>/data/adb/ksu/bin/busybox</code> に配置されています。KernelSU の Busybox はランタイムに切り替え可能な「ASH スタンドアローンシェルモード」をサポートしています。このスタンドアロンモードとは、Busybox の <code>ash</code> シェルで実行する場合 <code>PATH</code> として設定されているものに関係なく、すべてのコマンドが Busybox 内のアプレットを直接使用するというものです。たとえば、<code>ls</code>、<code>rm</code>、<code>chmod</code> などのコマンドは、<code>PATH</code> にあるもの（Android の場合、デフォルトではそれぞれ <code>/system/bin/ls</code>, <code>/system/bin/rm</code>, <code>/system/bin/chmod</code>）ではなく、直接 Busybox 内部のアプレットを呼び出すことになります。これにより、スクリプトは常に予測可能な環境で実行され、どの Android バージョンで実行されていても常にコマンドを利用できます。Busybox を使用しないコマンドを強制的に実行するには、フルパスで実行ファイルを呼び出す必要があります。</p><p>KernelSU のコンテキストで実行されるすべてのシェルスクリプトは、Busybox の <code>ash</code> シェルでスタンドアロンモードが有効な状態で実行されます。サードパーティの開発者に関係するものとしては、すべてのブートスクリプトとモジュールのインストールスクリプトが含まれます。</p><p>この「スタンドアロンモード」機能を KernelSU 以外で使用したい場合、2つの方法で有効にできます：</p><ol><li>環境変数 <code>ASH_STANDALONE</code> を <code>1</code> にする<br>例: <code>ASH_STANDALONE=1 /data/adb/ksu/bin/busybox sh &lt;script&gt;</code></li><li>コマンドラインのオプションで変更する:<br><code>/data/adb/ksu/bin/busybox sh -o standalone &lt;script&gt;</code></li></ol><p>環境変数が子プロセスに継承されるため、その後に実行されるすべての <code>sh</code> シェルもスタンドアロンモードで実行されるようにするにはオプション 1 が望ましい方法です（KernelSU と KernelSU Managerが内部的に使用しているのもこちらです）。</p><div class="tip custom-block"><p class="custom-block-title">Magisk との違い</p><p>KernelSU の Busybox は、Magisk プロジェクトから直接コンパイルされたバイナリファイルを使用するようになりました。Magisk と KernelSU の Busybox スクリプトはまったく同じものなので、互換性の問題を心配する必要はありません！</p></div><h2 id="kernelsu-モジュール" tabindex="-1">KernelSU モジュール <a class="header-anchor" href="#kernelsu-モジュール" aria-label="Permalink to &quot;KernelSU モジュール&quot;">​</a></h2><p>KernelSU モジュールは、<code>/data/adb/modules</code> に配置された以下の構造を持つフォルダーです：</p><div class="language-txt vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">txt</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">/data/adb/modules</span></span>
<span class="line"><span style="color:#e1e4e8;">├── .</span></span>
<span class="line"><span style="color:#e1e4e8;">├── .</span></span>
<span class="line"><span style="color:#e1e4e8;">|</span></span>
<span class="line"><span style="color:#e1e4e8;">├── $MODID                  &lt;--- フォルダの名前はモジュールの ID で付けます</span></span>
<span class="line"><span style="color:#e1e4e8;">│   │</span></span>
<span class="line"><span style="color:#e1e4e8;">│   │      *** モジュールの ID ***</span></span>
<span class="line"><span style="color:#e1e4e8;">│   │</span></span>
<span class="line"><span style="color:#e1e4e8;">│   ├── module.prop         &lt;--- このファイルにモジュールのメタデータを保存します</span></span>
<span class="line"><span style="color:#e1e4e8;">│   │</span></span>
<span class="line"><span style="color:#e1e4e8;">│   │      *** メインコンテンツ ***</span></span>
<span class="line"><span style="color:#e1e4e8;">│   │</span></span>
<span class="line"><span style="color:#e1e4e8;">│   ├── system              &lt;--- skip_mount が存在しない場合、このフォルダがマウントされます</span></span>
<span class="line"><span style="color:#e1e4e8;">│   │   ├── ...</span></span>
<span class="line"><span style="color:#e1e4e8;">│   │   ├── ...</span></span>
<span class="line"><span style="color:#e1e4e8;">│   │   └── ...</span></span>
<span class="line"><span style="color:#e1e4e8;">│   │</span></span>
<span class="line"><span style="color:#e1e4e8;">│   │      *** ステータスフラグ ***</span></span>
<span class="line"><span style="color:#e1e4e8;">│   │</span></span>
<span class="line"><span style="color:#e1e4e8;">│   ├── skip_mount          &lt;--- 存在する場合、KernelSU はシステムフォルダをマウントしません</span></span>
<span class="line"><span style="color:#e1e4e8;">│   ├── disable             &lt;--- 存在する場合、モジュールは無効化されます</span></span>
<span class="line"><span style="color:#e1e4e8;">│   ├── remove              &lt;--- 存在する場合、次の再起動時にモジュールが削除されます</span></span>
<span class="line"><span style="color:#e1e4e8;">│   │</span></span>
<span class="line"><span style="color:#e1e4e8;">│   │      *** 任意のファイル ***</span></span>
<span class="line"><span style="color:#e1e4e8;">│   │</span></span>
<span class="line"><span style="color:#e1e4e8;">│   ├── post-fs-data.sh     &lt;--- このスクリプトは post-fs-data で実行されます</span></span>
<span class="line"><span style="color:#e1e4e8;">│   ├── service.sh          &lt;--- このスクリプトは late_start サービスで実行されます</span></span>
<span class="line"><span style="color:#e1e4e8;">|   ├── uninstall.sh        &lt;--- このスクリプトは KernelSU がモジュールを削除するときに実行されます</span></span>
<span class="line"><span style="color:#e1e4e8;">│   ├── system.prop         &lt;--- このファイルのプロパティは resetprop によってシステムプロパティとして読み込まれます</span></span>
<span class="line"><span style="color:#e1e4e8;">│   ├── sepolicy.rule       &lt;--- カスタム SEPolicy ルールを追加します</span></span>
<span class="line"><span style="color:#e1e4e8;">│   │</span></span>
<span class="line"><span style="color:#e1e4e8;">│   │      *** 自動生成されるため、手動で作成または変更しないでください ***</span></span>
<span class="line"><span style="color:#e1e4e8;">│   │</span></span>
<span class="line"><span style="color:#e1e4e8;">│   ├── vendor              &lt;--- $MODID/system/vendor へのシンボリックリンク</span></span>
<span class="line"><span style="color:#e1e4e8;">│   ├── product             &lt;--- $MODID/system/product へのシンボリックリンク</span></span>
<span class="line"><span style="color:#e1e4e8;">│   ├── system_ext          &lt;--- $MODID/system/system_ext へのシンボリックリンク</span></span>
<span class="line"><span style="color:#e1e4e8;">│   │</span></span>
<span class="line"><span style="color:#e1e4e8;">│   │      *** その他のファイル/フォルダの追加も可能です ***</span></span>
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
<span class="line"><span style="color:#24292e;">├── $MODID                  &lt;--- フォルダの名前はモジュールの ID で付けます</span></span>
<span class="line"><span style="color:#24292e;">│   │</span></span>
<span class="line"><span style="color:#24292e;">│   │      *** モジュールの ID ***</span></span>
<span class="line"><span style="color:#24292e;">│   │</span></span>
<span class="line"><span style="color:#24292e;">│   ├── module.prop         &lt;--- このファイルにモジュールのメタデータを保存します</span></span>
<span class="line"><span style="color:#24292e;">│   │</span></span>
<span class="line"><span style="color:#24292e;">│   │      *** メインコンテンツ ***</span></span>
<span class="line"><span style="color:#24292e;">│   │</span></span>
<span class="line"><span style="color:#24292e;">│   ├── system              &lt;--- skip_mount が存在しない場合、このフォルダがマウントされます</span></span>
<span class="line"><span style="color:#24292e;">│   │   ├── ...</span></span>
<span class="line"><span style="color:#24292e;">│   │   ├── ...</span></span>
<span class="line"><span style="color:#24292e;">│   │   └── ...</span></span>
<span class="line"><span style="color:#24292e;">│   │</span></span>
<span class="line"><span style="color:#24292e;">│   │      *** ステータスフラグ ***</span></span>
<span class="line"><span style="color:#24292e;">│   │</span></span>
<span class="line"><span style="color:#24292e;">│   ├── skip_mount          &lt;--- 存在する場合、KernelSU はシステムフォルダをマウントしません</span></span>
<span class="line"><span style="color:#24292e;">│   ├── disable             &lt;--- 存在する場合、モジュールは無効化されます</span></span>
<span class="line"><span style="color:#24292e;">│   ├── remove              &lt;--- 存在する場合、次の再起動時にモジュールが削除されます</span></span>
<span class="line"><span style="color:#24292e;">│   │</span></span>
<span class="line"><span style="color:#24292e;">│   │      *** 任意のファイル ***</span></span>
<span class="line"><span style="color:#24292e;">│   │</span></span>
<span class="line"><span style="color:#24292e;">│   ├── post-fs-data.sh     &lt;--- このスクリプトは post-fs-data で実行されます</span></span>
<span class="line"><span style="color:#24292e;">│   ├── service.sh          &lt;--- このスクリプトは late_start サービスで実行されます</span></span>
<span class="line"><span style="color:#24292e;">|   ├── uninstall.sh        &lt;--- このスクリプトは KernelSU がモジュールを削除するときに実行されます</span></span>
<span class="line"><span style="color:#24292e;">│   ├── system.prop         &lt;--- このファイルのプロパティは resetprop によってシステムプロパティとして読み込まれます</span></span>
<span class="line"><span style="color:#24292e;">│   ├── sepolicy.rule       &lt;--- カスタム SEPolicy ルールを追加します</span></span>
<span class="line"><span style="color:#24292e;">│   │</span></span>
<span class="line"><span style="color:#24292e;">│   │      *** 自動生成されるため、手動で作成または変更しないでください ***</span></span>
<span class="line"><span style="color:#24292e;">│   │</span></span>
<span class="line"><span style="color:#24292e;">│   ├── vendor              &lt;--- $MODID/system/vendor へのシンボリックリンク</span></span>
<span class="line"><span style="color:#24292e;">│   ├── product             &lt;--- $MODID/system/product へのシンボリックリンク</span></span>
<span class="line"><span style="color:#24292e;">│   ├── system_ext          &lt;--- $MODID/system/system_ext へのシンボリックリンク</span></span>
<span class="line"><span style="color:#24292e;">│   │</span></span>
<span class="line"><span style="color:#24292e;">│   │      *** その他のファイル/フォルダの追加も可能です ***</span></span>
<span class="line"><span style="color:#24292e;">│   │</span></span>
<span class="line"><span style="color:#24292e;">│   ├── ...</span></span>
<span class="line"><span style="color:#24292e;">│   └── ...</span></span>
<span class="line"><span style="color:#24292e;">|</span></span>
<span class="line"><span style="color:#24292e;">├── another_module</span></span>
<span class="line"><span style="color:#24292e;">│   ├── .</span></span>
<span class="line"><span style="color:#24292e;">│   └── .</span></span>
<span class="line"><span style="color:#24292e;">├── .</span></span>
<span class="line"><span style="color:#24292e;">├── .</span></span></code></pre></div><div class="tip custom-block"><p class="custom-block-title">Magisk との違い</p><p>KernelSU は Zygisk をビルトインでサポートしていないため、モジュール内に Zygisk に関連するコンテンツは存在しません。 しかし、<a href="https://github.com/Dr-TSNG/ZygiskNext" target="_blank" rel="noreferrer">ZygiskNext</a> をインストールすれば Zygisk モジュールを使えます。その場合の Zygisk モジュールのコンテンツは Magisk と同じです。</p></div><h3 id="module-prop" tabindex="-1">module.prop <a class="header-anchor" href="#module-prop" aria-label="Permalink to &quot;module.prop&quot;">​</a></h3><p>module.prop はモジュールの設定ファイルです。KernelSU ではこのファイルを含まないモジュールは、モジュールとして認識されません。このファイルの形式は以下の通りです：</p><div class="language-txt vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">txt</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">id=&lt;string&gt;</span></span>
<span class="line"><span style="color:#e1e4e8;">name=&lt;string&gt;</span></span>
<span class="line"><span style="color:#e1e4e8;">version=&lt;string&gt;</span></span>
<span class="line"><span style="color:#e1e4e8;">versionCode=&lt;int&gt;</span></span>
<span class="line"><span style="color:#e1e4e8;">author=&lt;string&gt;</span></span>
<span class="line"><span style="color:#e1e4e8;">description=&lt;string&gt;</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">id=&lt;string&gt;</span></span>
<span class="line"><span style="color:#24292e;">name=&lt;string&gt;</span></span>
<span class="line"><span style="color:#24292e;">version=&lt;string&gt;</span></span>
<span class="line"><span style="color:#24292e;">versionCode=&lt;int&gt;</span></span>
<span class="line"><span style="color:#24292e;">author=&lt;string&gt;</span></span>
<span class="line"><span style="color:#24292e;">description=&lt;string&gt;</span></span></code></pre></div><ul><li><code>id</code> はこの正規表現に一致していなければいけません: <code>^[a-zA-Z][a-zA-Z0-9._-]+$</code><br> 例: ✓ <code>a_module</code>, ✓ <code>a.module</code>, ✓ <code>module-101</code>, ✗ <code>a module</code>, ✗ <code>1_module</code>, ✗ <code>-a-module</code><br> これはモジュールの<strong>ユニークな ID</strong> です。公開後は変更しないでください。</li><li><code>versionCode</code> は <strong>integer</strong> です。バージョンの比較に使います。</li><li>他のものには<strong>単一行</strong> の文字であれば何でも使えます。</li><li>改行文字は <code>UNIX (LF)</code> を使ってください。<code>Windows (CR+LF)</code> や <code>Macintosh (CR)</code> は使ってはいけません。</li></ul><h3 id="シェルスクリプト" tabindex="-1">シェルスクリプト <a class="header-anchor" href="#シェルスクリプト" aria-label="Permalink to &quot;シェルスクリプト&quot;">​</a></h3><p><code>post-fs-data.sh</code> と <code>service.sh</code> の違いについては、<a href="#boot-scripts">ブートスクリプト</a>のセクションを読んでください。ほとんどのモジュール開発者にとって、ブートスクリプトを実行するだけなら <code>service.sh</code> で十分なはずです。</p><p>モジュールのすべてのスクリプトでは、<code>MODDIR=\${0%/*}</code>を使えばモジュールのベースディレクトリのパスを取得できます。スクリプト内でモジュールのパスをハードコードしないでください。</p><div class="tip custom-block"><p class="custom-block-title">Magisk との違い</p><p>環境変数 <code>KSU</code> を使用すると、スクリプトが KernelSU と Magisk どちらで実行されているかを判断できます。KernelSU で実行されている場合、この値は <code>true</code> に設定されます。</p></div><h3 id="system-ディレクトリ" tabindex="-1"><code>system</code> ディレクトリ <a class="header-anchor" href="#system-ディレクトリ" aria-label="Permalink to &quot;\`system\` ディレクトリ&quot;">​</a></h3><p>このディレクトリの内容は、システムの起動後に OverlayFS を使用してシステムの /system パーティションの上にオーバーレイされます：</p><ol><li>システム内の対応するディレクトリにあるファイルと同名のファイルは、このディレクトリにあるファイルで上書きされます。</li><li>システム内の対応するディレクトリにあるフォルダと同じ名前のフォルダは、このディレクトリにあるフォルダと統合されます。</li></ol><p>元のシステムディレクトリにあるファイルやフォルダを削除したい場合は、<code>mknod filename c 0 0</code> を使ってモジュールディレクトリにそのファイル/フォルダと同じ名前のファイルを作成する必要があります。こうすることで、OverlayFS システムはこのファイルを削除したかのように自動的に「ホワイトアウト」します（/system パーティションは実際には変更されません）。</p><p>また、<code>customize.sh</code> 内で <code>REMOVE</code> という変数に削除操作を実行するディレクトリのリストを宣言すると、KernelSU は自動的にそのモジュールの対応するディレクトリで <code>mknod &lt;TARGET&gt; c 0 0</code> を実行します。例えば</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">REMOVE</span><span style="color:#F97583;">=</span><span style="color:#9ECBFF;">&quot;</span></span>
<span class="line"><span style="color:#9ECBFF;">/system/app/YouTube</span></span>
<span class="line"><span style="color:#9ECBFF;">/system/app/Bloatware</span></span>
<span class="line"><span style="color:#9ECBFF;">&quot;</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">REMOVE</span><span style="color:#D73A49;">=</span><span style="color:#032F62;">&quot;</span></span>
<span class="line"><span style="color:#032F62;">/system/app/YouTube</span></span>
<span class="line"><span style="color:#032F62;">/system/app/Bloatware</span></span>
<span class="line"><span style="color:#032F62;">&quot;</span></span></code></pre></div><p>上記の場合は、<code>mknod $MODPATH/system/app/YouTuBe c 0 0</code>と<code>mknod $MODPATH/system/app/Bloatware c 0 0</code>を実行し、<code>/system/app/YouTube</code>と<code>/system/app/Bloatware</code>はモジュール有効化後に削除されます。</p><p>システム内のディレクトリを置き換えたい場合は、モジュールディレクトリに同じパスのディレクトリを作成し、このディレクトリに <code>setfattr -n trusted.overlay.opaque -v y &lt;TARGET&gt;</code> という属性を設定する必要があります。こうすることで、OverlayFS システムは（/system パーティションを変更することなく）システム内の対応するディレクトリを自動的に置き換えることができます。</p><p><code>customize.sh</code> ファイル内に <code>REPLACE</code> という変数を宣言し、その中に置換するディレクトリのリストを入れておけば、KernelSU は自動的にモジュールディレクトリに対応した処理を行います。例えば：</p><p>REPLACE=&quot; /system/app/YouTube /system/app/Bloatware &quot;</p><p>このリストは、自動的に <code>$MODPATH/system/app/YouTube</code> と <code>$MODPATH/system/app/Bloatware</code> というディレクトリを作成し、 <code>setfattr -n trusted.overlay.opaque -v y $MODPATH/system/app/YouTube</code> と <code>setfattr -n trusted.overlay.opaque -v y $MODPATH/system/app/Bloatware</code> を実行します。モジュールが有効になると、<code>/system/app/YouTube</code> と <code>/system/app/Bloatware</code> は空のディレクトリに置き換えられます。</p><div class="tip custom-block"><p class="custom-block-title">Magisk との違い</p><p>KernelSU のシステムレスメカニズムはカーネルの OverlayFS によって実装され、Magisk は現在マジックマウント（bind mount）を使用しています。この2つの実装方法には大きな違いがありますが最終的な目的は同じで、/system パーティションを物理的に変更することなく、/system のファイルを変更できます。</p></div><p>OverlayFS に興味があれば、Linux カーネルの <a href="https://docs.kernel.org/filesystems/overlayfs.html" target="_blank" rel="noreferrer">OverlayFS のドキュメンテーション</a> を読んでみてください。</p><h3 id="system-prop" tabindex="-1">system.prop <a class="header-anchor" href="#system-prop" aria-label="Permalink to &quot;system.prop&quot;">​</a></h3><p>このファイルは <code>build.prop</code> と同じ形式をとっています。各行は <code>[key]=[value]</code> で構成されます。</p><h3 id="sepolicy-rule" tabindex="-1">sepolicy.rule <a class="header-anchor" href="#sepolicy-rule" aria-label="Permalink to &quot;sepolicy.rule&quot;">​</a></h3><p>もしあなたのモジュールが追加の SEPolicy パッチを必要とする場合は、それらのルールをこのファイルに追加してください。このファイルの各行は、ポリシーステートメントとして扱われます。</p><h2 id="モジュールのインストーラー" tabindex="-1">モジュールのインストーラー <a class="header-anchor" href="#モジュールのインストーラー" aria-label="Permalink to &quot;モジュールのインストーラー&quot;">​</a></h2><p>KernelSU モジュールインストーラーは、KernelSU Manager アプリでインストールできる、ZIP ファイルにパッケージされた KernelSU モジュールです。最もシンプルな KernelSU モジュールインストーラーは、KernelSU モジュールを ZIP ファイルとしてパックしただけのものです。</p><div class="language-txt vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">txt</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">module.zip</span></span>
<span class="line"><span style="color:#e1e4e8;">│</span></span>
<span class="line"><span style="color:#e1e4e8;">├── customize.sh                       &lt;--- (任意、詳細は後述)</span></span>
<span class="line"><span style="color:#e1e4e8;">│                                           このスクリプトは update-binary から読み込まれます</span></span>
<span class="line"><span style="color:#e1e4e8;">├── ...</span></span>
<span class="line"><span style="color:#e1e4e8;">├── ...  /* 残りのモジュールのファイル */</span></span>
<span class="line"><span style="color:#e1e4e8;">│</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">module.zip</span></span>
<span class="line"><span style="color:#24292e;">│</span></span>
<span class="line"><span style="color:#24292e;">├── customize.sh                       &lt;--- (任意、詳細は後述)</span></span>
<span class="line"><span style="color:#24292e;">│                                           このスクリプトは update-binary から読み込まれます</span></span>
<span class="line"><span style="color:#24292e;">├── ...</span></span>
<span class="line"><span style="color:#24292e;">├── ...  /* 残りのモジュールのファイル */</span></span>
<span class="line"><span style="color:#24292e;">│</span></span></code></pre></div><div class="warning custom-block"><p class="custom-block-title">警告</p><p>KernelSU モジュールは、カスタムリカバリーからのインストールには非対応です！</p></div><h3 id="カスタマイズ" tabindex="-1">カスタマイズ <a class="header-anchor" href="#カスタマイズ" aria-label="Permalink to &quot;カスタマイズ&quot;">​</a></h3><p>モジュールのインストールプロセスをカスタマイズする必要がある場合、<code>customize.sh</code> という名前のスクリプトを作成してください。このスクリプトは、すべてのファイルが抽出され、デフォルトのパーミッションと secontext が適用された後、モジュールインストーラースクリプトによって読み込み (実行ではなく) されます。これは、モジュールがデバイスの ABI に基づいて追加設定を必要とする場合や、モジュールファイルの一部に特別なパーミッション/コンテキストを設定する必要がある場合に、非常に便利です。</p><p>インストールプロセスを完全に制御しカスタマイズしたい場合は、<code>customize.sh</code> で <code>SKIPUNZIP=1</code> と宣言すればデフォルトのインストールステップをすべてスキップできます。そうすることで、<code>customize.sh</code> が責任をもってすべてをインストールするようになります。</p><p><code>customize.sh</code>スクリプトは、KernelSU の Busybox <code>ash</code> シェルで、「スタンドアロンモード」を有効にして実行します。以下の変数と関数が利用可能です：</p><h4 id="変数" tabindex="-1">変数 <a class="header-anchor" href="#変数" aria-label="Permalink to &quot;変数&quot;">​</a></h4><ul><li><code>KSU</code> (bool): スクリプトが KernelSU 環境で実行されていることを示すための変数で、この変数の値は常に true になります。KernelSU と Magisk を区別するために使用できます。</li><li><code>KSU_VER</code> (string): 現在インストールされている KernelSU のバージョン文字列 (例: <code>v0.4.0</code>)</li><li><code>KSU_VER_CODE</code> (int): ユーザー空間に現在インストールされているKernelSUのバージョンコード (例: <code>10672</code>)</li><li><code>KSU_KERNEL_VER_CODE</code> (int): 現在インストールされている KernelSU のカーネル空間でのバージョンコード（例：<code>10672</code>）</li><li><code>BOOTMODE</code> (bool): KernelSU では常に <code>true</code></li><li><code>MODPATH</code> (path): モジュールファイルがインストールされるパス</li><li><code>TMPDIR</code> (path): ファイルを一時的に保存しておく場所</li><li><code>ZIPFILE</code> (path): あなたのモジュールのインストールZIP</li><li><code>ARCH</code> (string): デバイスの CPU アーキテクチャ。値は <code>arm</code>、<code>arm64</code>、<code>x86</code>、<code>x64</code> のいずれか</li><li><code>IS64BIT</code> (bool): <code>ARCH</code> が <code>arm64</code> または <code>x64</code> のときは <code>true</code></li><li><code>API</code> (int): 端末の API レベル・Android のバージョン（例：Android 6.0 なら<code>23</code>）</li></ul><div class="warning custom-block"><p class="custom-block-title">警告</p><p>KernelSU では、MAGISK_VER_CODE は常に25200、MAGISK_VER は常にv25.2です。この2つの変数で KernelSU 上で動作しているかどうかを判断するのはやめてください。</p></div><h4 id="機能" tabindex="-1">機能 <a class="header-anchor" href="#機能" aria-label="Permalink to &quot;機能&quot;">​</a></h4><div class="language-txt vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">txt</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">ui_print &lt;msg&gt;</span></span>
<span class="line"><span style="color:#e1e4e8;">    コンソールに &lt;msg&gt; を表示します</span></span>
<span class="line"><span style="color:#e1e4e8;">    カスタムリカバリーのコンソールでは表示されないため、「echo」の使用は避けてください</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">abort &lt;msg&gt;</span></span>
<span class="line"><span style="color:#e1e4e8;">    エラーメッセージ&lt;msg&gt;をコンソールに出力し、インストールを終了させます</span></span>
<span class="line"><span style="color:#e1e4e8;">    終了時のクリーンアップがスキップされてしまうため、「exit」の使用は避けてください</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">set_perm &lt;target&gt; &lt;owner&gt; &lt;group&gt; &lt;permission&gt; [context]</span></span>
<span class="line"><span style="color:#e1e4e8;">    [context] が設定されていない場合、デフォルトは &quot;u:object_r:system_file:s0&quot; です。</span></span>
<span class="line"><span style="color:#e1e4e8;">    この機能は、次のコマンドの略記です：</span></span>
<span class="line"><span style="color:#e1e4e8;">       chown owner.group target</span></span>
<span class="line"><span style="color:#e1e4e8;">       chmod permission target</span></span>
<span class="line"><span style="color:#e1e4e8;">       chcon context target</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">set_perm_recursive &lt;directory&gt; &lt;owner&gt; &lt;group&gt; &lt;dirpermission&gt; &lt;filepermission&gt; [context]</span></span>
<span class="line"><span style="color:#e1e4e8;">    [context] が設定されていない場合、デフォルトは &quot;u:object_r:system_file:s0&quot; です。</span></span>
<span class="line"><span style="color:#e1e4e8;">    &lt;directory&gt; 内のすべてのファイルに対しては以下が実行されます:</span></span>
<span class="line"><span style="color:#e1e4e8;">       set_perm file owner group filepermission context</span></span>
<span class="line"><span style="color:#e1e4e8;">    &lt;directory&gt; 内のすべてのディレクトリ（自身を含む）に対しては以下が実行されます:</span></span>
<span class="line"><span style="color:#e1e4e8;">       set_perm dir owner group dirpermission context</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">ui_print &lt;msg&gt;</span></span>
<span class="line"><span style="color:#24292e;">    コンソールに &lt;msg&gt; を表示します</span></span>
<span class="line"><span style="color:#24292e;">    カスタムリカバリーのコンソールでは表示されないため、「echo」の使用は避けてください</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">abort &lt;msg&gt;</span></span>
<span class="line"><span style="color:#24292e;">    エラーメッセージ&lt;msg&gt;をコンソールに出力し、インストールを終了させます</span></span>
<span class="line"><span style="color:#24292e;">    終了時のクリーンアップがスキップされてしまうため、「exit」の使用は避けてください</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">set_perm &lt;target&gt; &lt;owner&gt; &lt;group&gt; &lt;permission&gt; [context]</span></span>
<span class="line"><span style="color:#24292e;">    [context] が設定されていない場合、デフォルトは &quot;u:object_r:system_file:s0&quot; です。</span></span>
<span class="line"><span style="color:#24292e;">    この機能は、次のコマンドの略記です：</span></span>
<span class="line"><span style="color:#24292e;">       chown owner.group target</span></span>
<span class="line"><span style="color:#24292e;">       chmod permission target</span></span>
<span class="line"><span style="color:#24292e;">       chcon context target</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">set_perm_recursive &lt;directory&gt; &lt;owner&gt; &lt;group&gt; &lt;dirpermission&gt; &lt;filepermission&gt; [context]</span></span>
<span class="line"><span style="color:#24292e;">    [context] が設定されていない場合、デフォルトは &quot;u:object_r:system_file:s0&quot; です。</span></span>
<span class="line"><span style="color:#24292e;">    &lt;directory&gt; 内のすべてのファイルに対しては以下が実行されます:</span></span>
<span class="line"><span style="color:#24292e;">       set_perm file owner group filepermission context</span></span>
<span class="line"><span style="color:#24292e;">    &lt;directory&gt; 内のすべてのディレクトリ（自身を含む）に対しては以下が実行されます:</span></span>
<span class="line"><span style="color:#24292e;">       set_perm dir owner group dirpermission context</span></span></code></pre></div><h2 id="ブートスクリプト" tabindex="-1">ブートスクリプト <a class="header-anchor" href="#ブートスクリプト" aria-label="Permalink to &quot;ブートスクリプト&quot;">​</a></h2><p>KernelSU では、スクリプトは実行モードによって post-fs-data モードと late_start サービスモードの2種類に分けられます：</p><ul><li>post-fs-data モード <ul><li>同期処理です。実行が終わるか、10秒が経過するまでブートプロセスが一時停止されます。</li><li>スクリプトはモジュールがマウントされる前に実行されます。モジュール開発者はモジュールがマウントされる前に、動的にモジュールを調整できます。</li><li>このステージは Zygote が始まる前に起こるので、Android のほぼすべての処理の前に割り込めます</li><li><strong>警告:</strong> <code>setprop</code> を使うとブートプロセスのデッドロックを引き起こします! <code>resetprop -n &lt;prop_name&gt; &lt;prop_value&gt;</code> を使ってください。</li><li><strong>本当に必要な場合だけこのモードでコマンド実行してください</strong></li></ul></li><li>late_start サービスモード <ul><li>非同期処理です。スクリプトは、起動プロセスの残りの部分と並行して実行されます。</li><li><strong>ほとんどのスクリプトにはこちらがおすすめです</strong></li></ul></li></ul><p>KernelSU では、起動スクリプトは保存場所によって一般スクリプトとモジュールスクリプトの2種類に分けられます：</p><ul><li>一般スクリプト <ul><li><code>/data/adb/post-fs-data.d</code> か <code>/data/adb/service.d</code> に配置されます</li><li>スクリプトが実行可能な状態に設定されている場合にのみ実行されます (<code>chmod +x script.sh</code>)</li><li><code>post-fs-data.d</code> のスクリプトは post-fs-data モードで実行され、<code>service.d</code> のスクリプトは late_start サービスモードで実行されます</li><li>モジュールはインストール時に一般スクリプトを追加するべきではありません</li></ul></li><li>モジュールスクリプト <ul><li>モジュール独自のフォルダに配置されます</li><li>モジュールが有効な場合のみ実行されます</li><li><code>post-fs-data.sh</code> は post-fs-data モードで実行され、<code>service.sh</code> は late_start サービスモードで実行されます</li></ul></li></ul><p>すべてのブートスクリプトは、KernelSU の Busybox <code>ash</code> シェルで「スタンドアロンモード」を有効にした状態で実行されます。</p>`,58),o=[p];function t(c,r,i,d,y,u){return e(),n("div",null,o)}const h=s(l,[["render",t]]);export{g as __pageData,h as default};
