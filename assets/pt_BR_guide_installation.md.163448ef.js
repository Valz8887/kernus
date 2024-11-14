import{_ as o,o as e,c as a,Q as r}from"./chunks/framework.ec8f7e8e.js";const h=JSON.parse('{"title":"Instalação","description":"","frontmatter":{},"headers":[],"relativePath":"pt_BR/guide/installation.md","filePath":"pt_BR/guide/installation.md"}'),s={name:"pt_BR/guide/installation.md"},i=r(`<h1 id="instalacao" tabindex="-1">Instalação <a class="header-anchor" href="#instalacao" aria-label="Permalink to &quot;Instalação&quot;">​</a></h1><h2 id="verifique-se-o-seu-dispositivo-e-compativel" tabindex="-1">Verifique se o seu dispositivo é compatível <a class="header-anchor" href="#verifique-se-o-seu-dispositivo-e-compativel" aria-label="Permalink to &quot;Verifique se o seu dispositivo é compatível&quot;">​</a></h2><p>Baixe o app gerenciador KernelSU em <a href="https://github.com/tiann/KernelSU/releases" target="_blank" rel="noreferrer">GitHub Releases</a> ou <a href="https://www.coolapk.com/apk/me.weishu.kernelsu" target="_blank" rel="noreferrer">Coolapk market</a>, e instale-o no seu dispositivo:</p><ul><li>Se o app mostrar <code>Sem suporte</code>, significa que <strong>você deve compilar o kernel sozinho</strong>, o KernelSU não fornecerá e nunca fornecerá uma boot image para você instalar.</li><li>Se o app mostrar <code>Não instalado</code>, então seu dispositivo é oficialmente suportado pelo KernelSU.</li></ul><div class="info custom-block"><p class="custom-block-title">INFORMAÇÕES</p><p>Para dispositivos mostrando <code>Sem suporte</code>, aqui está os <a href="./unofficially-support-devices.html">Dispositivos com suporte não oficial</a>, você mesmo pode compilar o kernel.</p></div><h2 id="backup-padrao-do-boot-img" tabindex="-1">Backup padrão do boot.img <a class="header-anchor" href="#backup-padrao-do-boot-img" aria-label="Permalink to &quot;Backup padrão do boot.img&quot;">​</a></h2><p>Antes de fleshar, você deve primeiro fazer backup do seu boot.img padrão. Se você encontrar algum bootloop, você sempre pode restaurar o sistema voltando para o boot de fábrica usando o fastboot.</p><div class="warning custom-block"><p class="custom-block-title">AVISO</p><p>Fleshar pode causar perda de dados, certifique-se de executar esta etapa bem antes de prosseguir para a próxima! Você também pode fazer backup de todos os dados do seu telefone, se necessário.</p></div><h2 id="conhecimento-necessario" tabindex="-1">Conhecimento necessário <a class="header-anchor" href="#conhecimento-necessario" aria-label="Permalink to &quot;Conhecimento necessário&quot;">​</a></h2><h3 id="adb-e-fastboot" tabindex="-1">ADB e fastboot <a class="header-anchor" href="#adb-e-fastboot" aria-label="Permalink to &quot;ADB e fastboot&quot;">​</a></h3><p>Por padrão, você usará as ferramentas ADB e fastboot neste tutorial, portanto, se você não as conhece, recomendamos pesquisar para aprender sobre elas primeiro.</p><h3 id="kmi" tabindex="-1">KMI <a class="header-anchor" href="#kmi" aria-label="Permalink to &quot;KMI&quot;">​</a></h3><p>Kernel Module Interface (KMI), versões de kernel com o mesmo KMI são <strong>compatíveis</strong>, isso é o que &quot;geral&quot; significa no GKI; por outro lado, se o KMI for diferente, então esses kernels não são compatíveis entre si, e atualizar uma imagem do kernel com um KMI diferente do seu dispositivo pode causar um bootloop.</p><p>Especificamente, para dispositivos GKI, o formato da versão do kernel deve ser o seguinte:</p><div class="language-txt vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">txt</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">KernelRelease :=</span></span>
<span class="line"><span style="color:#e1e4e8;">Version.PatchLevel.SubLevel-AndroidRelease-KmiGeneration-suffix</span></span>
<span class="line"><span style="color:#e1e4e8;">w      .x         .y       -zzz           -k            -something</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">KernelRelease :=</span></span>
<span class="line"><span style="color:#24292e;">Version.PatchLevel.SubLevel-AndroidRelease-KmiGeneration-suffix</span></span>
<span class="line"><span style="color:#24292e;">w      .x         .y       -zzz           -k            -something</span></span></code></pre></div><p><code>w.x-zzz-k</code> é a versão KMI. Por exemplo, se a versão do kernel de um dispositivo for <code>5.10.101-android12-9-g30979850fc20</code>, então seu KMI será <code>5.10-android12-9</code>. Teoricamente, ele pode inicializar normalmente com outros kernels KMI.</p><div class="tip custom-block"><p class="custom-block-title">DICA</p><p>Observe que o SubLevel na versão do kernel não faz parte do KMI! Isso significa que <code>5.10.101-android12-9-g30979850fc20</code> tem o mesmo KMI que <code>5.10.137-android12-9-g30979850fc20</code>!</p></div><h3 id="versao-do-kernel-vs-versao-do-android" tabindex="-1">Versão do kernel vs Versão do Android <a class="header-anchor" href="#versao-do-kernel-vs-versao-do-android" aria-label="Permalink to &quot;Versão do kernel vs Versão do Android&quot;">​</a></h3><p>Por favor, observe: <strong>A versão do kernel e a versão do Android não são necessariamente iguais!</strong></p><p>Se você descobrir que a versão do seu kernel é <code>android12-5.10.101</code>, mas a versão do seu sistema Android é Android 13 ou outra, não se surpreenda, pois o número da versão do sistema Android não é necessariamente igual ao número da versão do kernel Linux. O número da versão do kernel Linux geralmente é consistente com a versão do sistema Android que acompanha o <strong>dispositivo quando ele é enviado</strong>. Se o sistema Android for atualizado posteriormente, a versão do kernel geralmente não será alterada. Se você precisar fazer o flash, <strong>por favor, consulte sempre a versão do kernel!</strong></p><h2 id="introducao" tabindex="-1">Introdução <a class="header-anchor" href="#introducao" aria-label="Permalink to &quot;Introdução&quot;">​</a></h2><p>Existem vários métodos de instalação do KernelSU, cada um adequado para um cenário diferente, portanto escolha conforme necessário.</p><ol><li>Instalar com Recovery personalizado (por exemplo, TWRP)</li><li>Instalar com um app kernel flash, como Franco Kernel Manager</li><li>Instalar com fastboot usando o boot.img fornecido por KernelSU</li><li>Repare o boot.img manualmente e instale-o</li></ol><h2 id="instalar-com-recovery-personalizado" tabindex="-1">Instalar com Recovery personalizado <a class="header-anchor" href="#instalar-com-recovery-personalizado" aria-label="Permalink to &quot;Instalar com Recovery personalizado&quot;">​</a></h2><p>Pré-requisito: Seu dispositivo deve ter um Recovery personalizado, como TWRP. Se apenas o Recovery oficial estiver disponível, use outro método.</p><p>Etapa:</p><ol><li>Na <a href="https://github.com/tiann/KernelSU/releases" target="_blank" rel="noreferrer">página de lançamento</a> do KernelSU, baixe o pacote zip começando com AnyKernel3 que corresponde à versão do seu telefone; por exemplo, a versão do kernel do telefone é <code>android12-5.10. 66</code>, então você deve baixar o arquivo <code>AnyKernel3-android12-5.10.66_yyyy-MM.zip</code> (onde <code>yyyy</code> é o ano e <code>MM</code> é o mês).</li><li>Reinicie o telefone no TWRP.</li><li>Use o adb para colocar AnyKernel3-*.zip no telefone /sdcard e escolha instalá-lo na interface do TWRP; ou você pode diretamente <code>adb sideload AnyKernel-*.zip</code> para instalar.</li></ol><p>PS. Este método é adequado para qualquer instalação (não limitado à instalação inicial ou atualizações subsequentes), desde que você use TWRP.</p><h2 id="instalar-com-kernel-flasher" tabindex="-1">Instalar com Kernel Flasher <a class="header-anchor" href="#instalar-com-kernel-flasher" aria-label="Permalink to &quot;Instalar com Kernel Flasher&quot;">​</a></h2><p>Pré-requisito: Seu dispositivo deve estar rooteado. Por exemplo, você instalou o Magisk para obter root ou instalou uma versão antiga do KernelSU e precisa atualizar para outra versão do KernelSU. Se o seu dispositivo não estiver rooteado, tente outros métodos.</p><p>Etapa:</p><ol><li>Baixe o zip AnyKernel3; consulte a seção <em>Instalar com Recovery personalizado</em> para obter instruções de download.</li><li>Abra o app Kernel Flash e use o zip AnyKernel3 fornecido para fazer o flash.</li></ol><p>Se você nunca usou algum app kernel flash antes, os seguintes são os mais populares.</p><ol><li><a href="https://github.com/capntrips/KernelFlasher/releases" target="_blank" rel="noreferrer">Kernel Flasher</a></li><li><a href="https://play.google.com/store/apps/details?id=com.franco.kernel" target="_blank" rel="noreferrer">Franco Kernel Manager</a></li><li><a href="https://play.google.com/store/apps/details?id=flar2.exkernelmanager" target="_blank" rel="noreferrer">Ex Kernel Manager</a></li></ol><p>PS. Este método é mais conveniente ao atualizar o KernelSU e pode ser feito sem um computador (backup primeiro).</p><h2 id="instalar-com-o-boot-img-fornecido-por-kernelsu" tabindex="-1">Instalar com o boot.img fornecido por KernelSU <a class="header-anchor" href="#instalar-com-o-boot-img-fornecido-por-kernelsu" aria-label="Permalink to &quot;Instalar com o boot.img fornecido por KernelSU&quot;">​</a></h2><p>Este método não requer que você tenha TWRP, nem que seu telefone tenha privilégios de root; é adequado para sua primeira instalação do KernelSU.</p><h3 id="encontre-o-boot-img-adequado" tabindex="-1">Encontre o boot.img adequado <a class="header-anchor" href="#encontre-o-boot-img-adequado" aria-label="Permalink to &quot;Encontre o boot.img adequado&quot;">​</a></h3><p>O KernelSU fornece um boot.img genérico para dispositivos GKI e você deve liberar o boot.img para a partição boot do dispositivo.</p><p>Você pode baixar o boot.img em <a href="https://github.com/tiann/KernelSU/releases" target="_blank" rel="noreferrer">GitHub Release</a>, por favor, observe que você deve usar a versão correta do boot.img. Por exemplo, se o seu dispositivo exibe o kernel <code>android12-5.10.101</code> , você precisa baixar <code>android-5.10.101_yyyy-MM.boot-&lt;format&gt;.img</code>. (Mantenha o KMI consistente!)</p><p>Onde <code>&lt;format&gt;</code> se refere ao formato de compactação do kernel do seu boot.img oficial, por favor, verifique o formato de compactação do kernel de seu boot.img original. Você deve usar o formato correto, por exemplo: <code>lz4</code>, <code>gz</code>. Se você usar um formato de compactação incorreto, poderá encontrar bootloop.</p><div class="info custom-block"><p class="custom-block-title">INFORMAÇÕES</p><ol><li>Você pode usar o magiskboot para obter o formato de compactação de seu boot original; é claro que você também pode perguntar a outras pessoas mais experientes com o mesmo modelo do seu dispositivo. Além disso, o formato de compactação do kernel geralmente não muda, portanto, se você inicializar com êxito com um determinado formato de compactação, poderá tentar esse formato mais tarde.</li><li>Os dispositivos Xiaomi geralmente usam <code>gz</code> ou <code>uncompressed</code>.</li><li>Para dispositivos Pixel, siga as instruções abaixo.</li></ol></div><h3 id="flash-boot-img-para-o-dispositivo" tabindex="-1">Flash boot.img para o dispositivo <a class="header-anchor" href="#flash-boot-img-para-o-dispositivo" aria-label="Permalink to &quot;Flash boot.img para o dispositivo&quot;">​</a></h3><p>Use o <code>adb</code> para conectar seu dispositivo, execute <code>adb reboot bootloader</code> para entrar no modo fastboot e use este comando para atualizar o KernelSU:</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#B392F0;">fastboot</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">flash</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">boot</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">boot.img</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6F42C1;">fastboot</span><span style="color:#24292E;"> </span><span style="color:#032F62;">flash</span><span style="color:#24292E;"> </span><span style="color:#032F62;">boot</span><span style="color:#24292E;"> </span><span style="color:#032F62;">boot.img</span></span></code></pre></div><div class="info custom-block"><p class="custom-block-title">INFORMAÇÕES</p><p>Se o seu dispositivo suportar <code>fastboot boot</code>, você pode usar primeiro <code>fastboot boot boot.img</code> para tentar usar o boot.img para inicializar o sistema primeiro. Se algo inesperado acontecer, reinicie-o novamente para inicializar.</p></div><h3 id="reiniciar" tabindex="-1">Reiniciar <a class="header-anchor" href="#reiniciar" aria-label="Permalink to &quot;Reiniciar&quot;">​</a></h3><p>Após a conclusão do flash, você deve reiniciar o dispositivo:</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#B392F0;">fastboot</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">reboot</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6F42C1;">fastboot</span><span style="color:#24292E;"> </span><span style="color:#032F62;">reboot</span></span></code></pre></div><h2 id="corrigir-boot-img-manualmente" tabindex="-1">Corrigir boot.img manualmente <a class="header-anchor" href="#corrigir-boot-img-manualmente" aria-label="Permalink to &quot;Corrigir boot.img manualmente&quot;">​</a></h2><p>Para alguns dispositivos, o formato boot.img não é tão comum, como <code>lz4</code>, <code>gz</code> e <code>uncompressed</code>. O mais típico é o Pixel, seu formato boot.img é <code>lz4_legacy</code> compactado, ramdisk pode ser <code>gz</code> também pode ser compactado <code>lz4_legacy</code>. Neste momento, se você fleshar diretamente o boot.img fornecido pelo KernelSU, o telefone pode não conseguir inicializar. Neste momento, você pode corrigir manualmente o boot.img para conseguir isso.</p><p>Geralmente existem dois métodos de patch:</p><ol><li><a href="https://forum.xda-developers.com/t/tool-android-image-kitchen-unpack-repack-kernel-ramdisk-win-android-linux-mac.2073775/" target="_blank" rel="noreferrer">Android-Image-Kitchen</a></li><li><a href="https://github.com/topjohnwu/Magisk/releases" target="_blank" rel="noreferrer">magiskboot</a></li></ol><p>Entre eles, o Android-Image-Kitchen é adequado para operação no PC e o magiskboot precisa da cooperação do telefone.</p><h3 id="preparacao" tabindex="-1">Preparação <a class="header-anchor" href="#preparacao" aria-label="Permalink to &quot;Preparação&quot;">​</a></h3><ol><li>Obtenha o boot.img padrão do telefone; você pode obtê-lo com os fabricantes do seu dispositivo, você pode precisar do <a href="https://github.com/ssut/payload-dumper-go" target="_blank" rel="noreferrer">payload-dumper-go</a>.</li><li>Baixe o arquivo zip AnyKernel3 fornecido pelo KernelSU que corresponde à versão KMI do seu dispositivo (você pode consultar <em>Instalar com Recovery personalizado</em>).</li><li>Descompacte o pacote AnyKernel3 e obtenha o arquivo <code>Image</code>, que é o arquivo do kernel do KernelSU.</li></ol><h3 id="usando-o-android-image-kitchen" tabindex="-1">Usando o Android-Image-Kitchen <a class="header-anchor" href="#usando-o-android-image-kitchen" aria-label="Permalink to &quot;Usando o Android-Image-Kitchen&quot;">​</a></h3><ol><li>Baixe o Android-Image-Kitchen para o seu computador.</li><li>Coloque o boot.img padrão na pasta raiz do Android-Image-Kitchen.</li><li>Execute <code>./unpackimg.sh boot.img</code> no diretório raiz do Android-Image-Kitchen, este comando descompactará o boot.img e você obterá alguns arquivos.</li><li>Substitua <code>boot.img-kernel</code> no diretório <code>split_img</code> pela <code>Image</code> que você extraiu do AnyKernel3 (observe a mudança de nome para boot.img-kernel).</li><li>Execute <code>./repackimg.sh</code> no diretório raiz de 在 Android-Image-Kitchen, e você obterá um arquivo chamado <code>image-new.img</code>. Faça o flash deste boot.img por fastboot (consulte a seção anterior).</li></ol><h3 id="usando-o-magiskboot" tabindex="-1">Usando o magiskboot <a class="header-anchor" href="#usando-o-magiskboot" aria-label="Permalink to &quot;Usando o magiskboot&quot;">​</a></h3><ol><li>Baixe o Magisk mais recente em <a href="https://github.com/topjohnwu/Magisk/releases" target="_blank" rel="noreferrer">GitHub Releases</a>.</li><li>Renomeie o Magisk-*.apk para Magisk-vesion.zip e descompacte-o.</li><li>Envie <code>Magisk-v25.2/lib/arm64-v8a/libmagiskboot.so</code> para o seu dispositivo por adb: <code>adb push Magisk-v25.2/lib/arm64-v8a/libmagiskboot.so /data/local/tmp/magiskboot</code>.</li><li>Envie o boot.img padrão e Image em AnyKernel3 para o seu dispositivo.</li><li>Entre no diretório adb shell e cd <code>/data/local/tmp/</code> e, em seguida, <code>chmod +x magiskboot</code>.</li><li>Entre no shell adb e no diretório cd <code>/data/local/tmp/</code>, execute <code>./magiskboot unpack boot.img</code> para descompactar <code>boot.img</code>, você obterá um arquivo <code>kernel</code>, este é o seu kernel padrão.</li><li>Substitua <code>kernel</code> por <code>Image</code>: <code>mv -f Image kernel</code>.</li><li>Execute <code>./magiskboot repack boot.img</code> para reembalar o boot.img, e você obterá um arquivo <code>new-boot.img</code>, faça o flash deste arquivo para o dispositivo por fastboot.</li></ol><h2 id="outros-metodos" tabindex="-1">Outros métodos <a class="header-anchor" href="#outros-metodos" aria-label="Permalink to &quot;Outros métodos&quot;">​</a></h2><p>Na verdade, todos esses métodos de instalação têm apenas uma ideia principal, que é <strong>substituir o kernel original pelo fornecido pelo KernelSU</strong>, desde que isso possa ser alcançado, ele pode ser instalado. Por exemplo, a seguir estão outros métodos possíveis.</p><ol><li>Primeiro instale o Magisk, obtenha privilégios de root através do Magisk e então use o kernel flasher para fazer o flash no zip AnyKernel do KernelSU.</li><li>Use algum kit de ferramentas de flash em PCs para fleshar no kernel fornecido pelo KernelSU.</li></ol>`,63),t=[i];function n(l,d,c,p,m,u){return e(),a("div",null,t)}const g=o(s,[["render",n]]);export{h as __pageData,g as default};
