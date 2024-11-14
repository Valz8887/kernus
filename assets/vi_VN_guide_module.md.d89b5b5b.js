import{_ as n,o as s,c as e,Q as a}from"./chunks/framework.ec8f7e8e.js";const y=JSON.parse('{"title":"Hướng dẫn mô-đun","description":"","frontmatter":{},"headers":[],"relativePath":"vi_VN/guide/module.md","filePath":"vi_VN/guide/module.md"}'),t={name:"vi_VN/guide/module.md"},c=a(`<h1 id="huong-dan-mo-đun" tabindex="-1">Hướng dẫn mô-đun <a class="header-anchor" href="#huong-dan-mo-đun" aria-label="Permalink to &quot;Hướng dẫn mô-đun&quot;">​</a></h1><p>KernelSU cung cấp một cơ chế mô-đun giúp đạt được hiệu quả sửa đổi thư mục hệ thống trong khi vẫn duy trì tính toàn vẹn của phân vùng system. Cơ chế này thường được gọi là &quot;systemless&quot;.</p><p>Cơ chế mô-đun của KernelSU gần giống với Magisk. Nếu bạn đã quen với việc phát triển mô-đun Magisk thì việc phát triển các mô-đun KernelSU cũng rất tương tự. Bạn có thể bỏ qua phần giới thiệu các mô-đun bên dưới và chỉ cần đọc <a href="./difference-with-magisk.html">difference-with-magisk</a>.</p><h2 id="busybox" tabindex="-1">Busybox <a class="header-anchor" href="#busybox" aria-label="Permalink to &quot;Busybox&quot;">​</a></h2><p>KernelSU cung cấp tính năng nhị phân BusyBox hoàn chỉnh (bao gồm hỗ trợ SELinux đầy đủ). Tệp thực thi được đặt tại <code>/data/adb/ksu/bin/busybox</code>. BusyBox của KernelSU hỗ trợ &quot;ASH Standalone Shell Mode&quot; có thể chuyển đổi thời gian chạy. Standalone mode này có nghĩa là khi chạy trong shell <code>ash</code> của BusyBox, mọi lệnh sẽ trực tiếp sử dụng applet trong BusyBox, bất kể cái gì được đặt là <code>PATH</code>. Ví dụ: các lệnh như <code>ls</code>, <code>rm</code>, <code>chmod</code> sẽ <strong>KHÔNG</strong> sử dụng những gì có trong <code>PATH</code> (trong trường hợp Android theo mặc định, nó sẽ là <code>/system/bin/ls</code>, <code> /system/bin/rm</code> và <code>/system/bin/chmod</code> tương ứng), nhưng thay vào đó sẽ gọi trực tiếp các ứng dụng BusyBox nội bộ. Điều này đảm bảo rằng các tập lệnh luôn chạy trong môi trường có thể dự đoán được và luôn có bộ lệnh đầy đủ cho dù nó đang chạy trên phiên bản Android nào. Để buộc lệnh <em>not</em> sử dụng BusyBox, bạn phải gọi tệp thực thi có đường dẫn đầy đủ.</p><p>Mỗi tập lệnh shell đơn lẻ chạy trong ngữ cảnh của KernelSU sẽ được thực thi trong shell <code>ash</code> của BusyBox với standalone mode được bật. Đối với những gì liên quan đến nhà phát triển bên thứ 3, điều này bao gồm tất cả các tập lệnh khởi động và tập lệnh cài đặt mô-đun.</p><p>Đối với những người muốn sử dụng tính năng &quot;Standalone mode&quot; này bên ngoài KernelSU, có 2 cách để kích hoạt tính năng này:</p><ol><li>Đặt biến môi trường <code>ASH_STANDALONE</code> thành <code>1</code><br>Ví dụ: <code>ASH_STANDALONE=1 /data/adb/ksu/bin/busybox sh &lt;script&gt;</code></li><li>Chuyển đổi bằng các tùy chọn dòng lệnh:<br><code>/data/adb/ksu/bin/busybox sh -o độc lập &lt;script&gt;</code></li></ol><p>Để đảm bảo tất cả shell <code>sh</code> tiếp theo được thực thi cũng chạy ở standalone mode, tùy chọn 1 là phương thức ưu tiên (và đây là những gì KernelSU và KernelSU manager sử dụng nội bộ) vì các biến môi trường được kế thừa xuống các tiến trình con.</p><div class="tip custom-block"><p class="custom-block-title">sự khác biệt với Magisk</p><p>BusyBox của KernelSU hiện đang sử dụng tệp nhị phân được biên dịch trực tiếp từ dự án Magisk. <strong>Cảm ơn Magisk!</strong> Vì vậy, bạn không phải lo lắng về vấn đề tương thích giữa các tập lệnh BusyBox trong Magisk và KernelSU vì chúng hoàn toàn giống nhau!</p></div><h2 id="mo-đun-hat-nhansu" tabindex="-1">Mô-đun hạt nhânSU <a class="header-anchor" href="#mo-đun-hat-nhansu" aria-label="Permalink to &quot;Mô-đun hạt nhânSU&quot;">​</a></h2><p>Mô-đun KernelSU là một thư mục được đặt trong <code>/data/adb/modules</code> với cấu trúc bên dưới:</p><div class="language-txt vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">txt</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">/data/adb/modules</span></span>
<span class="line"><span style="color:#e1e4e8;">├── .</span></span>
<span class="line"><span style="color:#e1e4e8;">├── .</span></span>
<span class="line"><span style="color:#e1e4e8;">|</span></span>
<span class="line"><span style="color:#e1e4e8;">├── $MODID                  &lt;--- Thư mục được đặt tên bằng ID của mô-đun</span></span>
<span class="line"><span style="color:#e1e4e8;">│   │</span></span>
<span class="line"><span style="color:#e1e4e8;">│   │      *** Nhận Dạng Mô-đun ***</span></span>
<span class="line"><span style="color:#e1e4e8;">│   │</span></span>
<span class="line"><span style="color:#e1e4e8;">│   ├── module.prop         &lt;--- Tệp này lưu trữ metadata của mô-đun</span></span>
<span class="line"><span style="color:#e1e4e8;">│   │</span></span>
<span class="line"><span style="color:#e1e4e8;">│   │      *** Nội Dung Chính ***</span></span>
<span class="line"><span style="color:#e1e4e8;">│   │</span></span>
<span class="line"><span style="color:#e1e4e8;">│   ├── system              &lt;--- Thư mục này sẽ được gắn kết nếu skip_mount không tồn tại</span></span>
<span class="line"><span style="color:#e1e4e8;">│   │   ├── ...</span></span>
<span class="line"><span style="color:#e1e4e8;">│   │   ├── ...</span></span>
<span class="line"><span style="color:#e1e4e8;">│   │   └── ...</span></span>
<span class="line"><span style="color:#e1e4e8;">│   │</span></span>
<span class="line"><span style="color:#e1e4e8;">│   │      *** Cờ Trạng Thái ***</span></span>
<span class="line"><span style="color:#e1e4e8;">│   │</span></span>
<span class="line"><span style="color:#e1e4e8;">│   ├── skip_mount          &lt;--- Nếu tồn tại, KernelSU sẽ KHÔNG gắn kết thư mục hệ thống của bạn</span></span>
<span class="line"><span style="color:#e1e4e8;">│   ├── disable             &lt;--- Nếu tồn tại, mô-đun sẽ bị vô hiệu hóa</span></span>
<span class="line"><span style="color:#e1e4e8;">│   ├── remove              &lt;--- Nếu tồn tại, mô-đun sẽ bị xóa trong lần khởi động lại tiếp theo</span></span>
<span class="line"><span style="color:#e1e4e8;">│   │</span></span>
<span class="line"><span style="color:#e1e4e8;">│   │      *** Tệp Tùy Chọn ***</span></span>
<span class="line"><span style="color:#e1e4e8;">│   │</span></span>
<span class="line"><span style="color:#e1e4e8;">│   ├── post-fs-data.sh     &lt;--- Tập lệnh này sẽ được thực thi trong post-fs-data</span></span>
<span class="line"><span style="color:#e1e4e8;">│   ├── post-mount.sh       &lt;--- Tập lệnh này sẽ được thực thi trong post-mount</span></span>
<span class="line"><span style="color:#e1e4e8;">│   ├── service.sh          &lt;--- Tập lệnh này sẽ được thực thi trong dịch vụ late_start</span></span>
<span class="line"><span style="color:#e1e4e8;">│   ├── boot-completed.sh   &lt;--- Tập lệnh này sẽ được thực thi khi khởi động xong</span></span>
<span class="line"><span style="color:#e1e4e8;">|   ├── uninstall.sh        &lt;--- Tập lệnh này sẽ được thực thi khi KernelSU xóa mô-đun của bạn</span></span>
<span class="line"><span style="color:#e1e4e8;">│   ├── system.prop         &lt;--- Các thuộc tính trong tệp này sẽ được tải dưới dạng thuộc tính hệ thống bằng resetprop</span></span>
<span class="line"><span style="color:#e1e4e8;">│   ├── sepolicy.rule       &lt;--- Quy tắc riêng biệt tùy chỉnh bổ sung</span></span>
<span class="line"><span style="color:#e1e4e8;">│   │</span></span>
<span class="line"><span style="color:#e1e4e8;">│   │      *** Được Tạo Tự Động, KHÔNG TẠO HOẶC SỬA ĐỔI THỦ CÔNG ***</span></span>
<span class="line"><span style="color:#e1e4e8;">│   │</span></span>
<span class="line"><span style="color:#e1e4e8;">│   ├── vendor              &lt;--- Một liên kết tượng trưng đến $MODID/system/vendor</span></span>
<span class="line"><span style="color:#e1e4e8;">│   ├── product             &lt;--- Một liên kết tượng trưng đến $MODID/system/product</span></span>
<span class="line"><span style="color:#e1e4e8;">│   ├── system_ext          &lt;--- Một liên kết tượng trưng đến $MODID/system/system_ext</span></span>
<span class="line"><span style="color:#e1e4e8;">│   │</span></span>
<span class="line"><span style="color:#e1e4e8;">│   │      *** Mọi tập tin / thư mục bổ sung đều được phép ***</span></span>
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
<span class="line"><span style="color:#24292e;">├── $MODID                  &lt;--- Thư mục được đặt tên bằng ID của mô-đun</span></span>
<span class="line"><span style="color:#24292e;">│   │</span></span>
<span class="line"><span style="color:#24292e;">│   │      *** Nhận Dạng Mô-đun ***</span></span>
<span class="line"><span style="color:#24292e;">│   │</span></span>
<span class="line"><span style="color:#24292e;">│   ├── module.prop         &lt;--- Tệp này lưu trữ metadata của mô-đun</span></span>
<span class="line"><span style="color:#24292e;">│   │</span></span>
<span class="line"><span style="color:#24292e;">│   │      *** Nội Dung Chính ***</span></span>
<span class="line"><span style="color:#24292e;">│   │</span></span>
<span class="line"><span style="color:#24292e;">│   ├── system              &lt;--- Thư mục này sẽ được gắn kết nếu skip_mount không tồn tại</span></span>
<span class="line"><span style="color:#24292e;">│   │   ├── ...</span></span>
<span class="line"><span style="color:#24292e;">│   │   ├── ...</span></span>
<span class="line"><span style="color:#24292e;">│   │   └── ...</span></span>
<span class="line"><span style="color:#24292e;">│   │</span></span>
<span class="line"><span style="color:#24292e;">│   │      *** Cờ Trạng Thái ***</span></span>
<span class="line"><span style="color:#24292e;">│   │</span></span>
<span class="line"><span style="color:#24292e;">│   ├── skip_mount          &lt;--- Nếu tồn tại, KernelSU sẽ KHÔNG gắn kết thư mục hệ thống của bạn</span></span>
<span class="line"><span style="color:#24292e;">│   ├── disable             &lt;--- Nếu tồn tại, mô-đun sẽ bị vô hiệu hóa</span></span>
<span class="line"><span style="color:#24292e;">│   ├── remove              &lt;--- Nếu tồn tại, mô-đun sẽ bị xóa trong lần khởi động lại tiếp theo</span></span>
<span class="line"><span style="color:#24292e;">│   │</span></span>
<span class="line"><span style="color:#24292e;">│   │      *** Tệp Tùy Chọn ***</span></span>
<span class="line"><span style="color:#24292e;">│   │</span></span>
<span class="line"><span style="color:#24292e;">│   ├── post-fs-data.sh     &lt;--- Tập lệnh này sẽ được thực thi trong post-fs-data</span></span>
<span class="line"><span style="color:#24292e;">│   ├── post-mount.sh       &lt;--- Tập lệnh này sẽ được thực thi trong post-mount</span></span>
<span class="line"><span style="color:#24292e;">│   ├── service.sh          &lt;--- Tập lệnh này sẽ được thực thi trong dịch vụ late_start</span></span>
<span class="line"><span style="color:#24292e;">│   ├── boot-completed.sh   &lt;--- Tập lệnh này sẽ được thực thi khi khởi động xong</span></span>
<span class="line"><span style="color:#24292e;">|   ├── uninstall.sh        &lt;--- Tập lệnh này sẽ được thực thi khi KernelSU xóa mô-đun của bạn</span></span>
<span class="line"><span style="color:#24292e;">│   ├── system.prop         &lt;--- Các thuộc tính trong tệp này sẽ được tải dưới dạng thuộc tính hệ thống bằng resetprop</span></span>
<span class="line"><span style="color:#24292e;">│   ├── sepolicy.rule       &lt;--- Quy tắc riêng biệt tùy chỉnh bổ sung</span></span>
<span class="line"><span style="color:#24292e;">│   │</span></span>
<span class="line"><span style="color:#24292e;">│   │      *** Được Tạo Tự Động, KHÔNG TẠO HOẶC SỬA ĐỔI THỦ CÔNG ***</span></span>
<span class="line"><span style="color:#24292e;">│   │</span></span>
<span class="line"><span style="color:#24292e;">│   ├── vendor              &lt;--- Một liên kết tượng trưng đến $MODID/system/vendor</span></span>
<span class="line"><span style="color:#24292e;">│   ├── product             &lt;--- Một liên kết tượng trưng đến $MODID/system/product</span></span>
<span class="line"><span style="color:#24292e;">│   ├── system_ext          &lt;--- Một liên kết tượng trưng đến $MODID/system/system_ext</span></span>
<span class="line"><span style="color:#24292e;">│   │</span></span>
<span class="line"><span style="color:#24292e;">│   │      *** Mọi tập tin / thư mục bổ sung đều được phép ***</span></span>
<span class="line"><span style="color:#24292e;">│   │</span></span>
<span class="line"><span style="color:#24292e;">│   ├── ...</span></span>
<span class="line"><span style="color:#24292e;">│   └── ...</span></span>
<span class="line"><span style="color:#24292e;">|</span></span>
<span class="line"><span style="color:#24292e;">├── another_module</span></span>
<span class="line"><span style="color:#24292e;">│   ├── .</span></span>
<span class="line"><span style="color:#24292e;">│   └── .</span></span>
<span class="line"><span style="color:#24292e;">├── .</span></span>
<span class="line"><span style="color:#24292e;">├── .</span></span></code></pre></div><div class="tip custom-block"><p class="custom-block-title">sự khác biệt với Magisk</p><p>KernelSU không có hỗ trợ tích hợp cho Zygisk nên không có nội dung liên quan đến Zygisk trong mô-đun. Tuy nhiên, bạn có thể sử dụng <a href="https://github.com/Dr-TSNG/ZygiskNext" target="_blank" rel="noreferrer">ZygiskNext</a> để hỗ trợ các mô-đun Zygisk. Trong trường hợp này, nội dung của mô-đun Zygisk giống hệt với nội dung được Magisk hỗ trợ.</p></div><h3 id="module-prop" tabindex="-1">module.prop <a class="header-anchor" href="#module-prop" aria-label="Permalink to &quot;module.prop&quot;">​</a></h3><p>module.prop là tệp cấu hình cho mô-đun. Trong KernelSU, nếu một mô-đun không chứa tệp này, nó sẽ không được nhận dạng là mô-đun. Định dạng của tập tin này như sau:</p><div class="language-txt vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">txt</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">id=&lt;string&gt;</span></span>
<span class="line"><span style="color:#e1e4e8;">name=&lt;string&gt;</span></span>
<span class="line"><span style="color:#e1e4e8;">version=&lt;string&gt;</span></span>
<span class="line"><span style="color:#e1e4e8;">versionCode=&lt;int&gt;</span></span>
<span class="line"><span style="color:#e1e4e8;">author=&lt;string&gt;</span></span>
<span class="line"><span style="color:#e1e4e8;">description=&lt;string&gt;</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">id=&lt;string&gt;</span></span>
<span class="line"><span style="color:#24292e;">name=&lt;string&gt;</span></span>
<span class="line"><span style="color:#24292e;">version=&lt;string&gt;</span></span>
<span class="line"><span style="color:#24292e;">versionCode=&lt;int&gt;</span></span>
<span class="line"><span style="color:#24292e;">author=&lt;string&gt;</span></span>
<span class="line"><span style="color:#24292e;">description=&lt;string&gt;</span></span></code></pre></div><ul><li><code>id</code> phải khớp với biểu thức chính quy này: <code>^[a-zA-Z][a-zA-Z0-9._-]+$</code><br> ví dụ: ✓ <code>a_module</code>, ✓ <code>a.module</code>, ✓ <code>module-101</code>, ✗ <code>a module</code>, ✗ <code>1_module</code>, ✗ <code>-a-module</code><br> Đây là <strong>mã định danh duy nhất</strong> của mô-đun của bạn. Bạn không nên thay đổi nó sau khi được xuất bản.</li><li><code>versionCode</code> phải là <strong>số nguyên</strong>. Điều này được sử dụng để so sánh các phiên bản</li><li>Các chuỗi khác không được đề cập ở trên có thể là chuỗi <strong>một dòng</strong> bất kỳ.</li><li>Đảm bảo sử dụng kiểu ngắt dòng <code>UNIX (LF)</code> chứ không phải <code>Windows (CR+LF)</code> hoặc <code>Macintosh (CR)</code>.</li></ul><h3 id="tap-lenh-shell" tabindex="-1">Tập lệnh Shell <a class="header-anchor" href="#tap-lenh-shell" aria-label="Permalink to &quot;Tập lệnh Shell&quot;">​</a></h3><p>Vui lòng đọc phần <a href="#boot-scripts">Boot Scripts</a> để hiểu sự khác biệt giữa <code>post-fs-data.sh</code> và <code>service.sh</code>. Đối với hầu hết các nhà phát triển mô-đun, <code>service.sh</code> sẽ đủ tốt nếu bạn chỉ cần chạy tập lệnh khởi động, nếu bạn cần chạy tập lệnh sau khi khởi động xong, vui lòng sử dụng <code>boot-completed.sh</code>. Nếu bạn muốn làm gì đó sau khi gắn các lớp phủ, vui lòng sử dụng <code>post-mount.sh</code>.</p><p>Trong tất cả các tập lệnh của mô-đun của bạn, vui lòng sử dụng <code>MODDIR=\${0%/*}</code> để lấy đường dẫn thư mục cơ sở của mô-đun của bạn; <strong>KHÔNG</strong> mã hóa cứng đường dẫn mô-đun của bạn trong tập lệnh.</p><div class="tip custom-block"><p class="custom-block-title">sự khác biệt với Magisk</p><p>Bạn có thể sử dụng biến môi trường KSU để xác định xem tập lệnh đang chạy trong KernelSU hay Magisk. Nếu chạy trong KernelSU, giá trị này sẽ được đặt thành true.</p></div><h3 id="thu-muc-system" tabindex="-1">thư mục <code>system</code> <a class="header-anchor" href="#thu-muc-system" aria-label="Permalink to &quot;thư mục \`system\`&quot;">​</a></h3><p>Nội dung của thư mục này sẽ được phủ lên trên phân vùng /system của hệ thống bằng cách sử dụng overlayfs sau khi hệ thống được khởi động. Điều này có nghĩa rằng:</p><ol><li>Các file có cùng tên với các file trong thư mục tương ứng trong hệ thống sẽ bị ghi đè bởi các file trong thư mục này.</li><li>Các thư mục có cùng tên với thư mục tương ứng trong hệ thống sẽ được gộp với các thư mục trong thư mục này.</li></ol><p>Nếu bạn muốn xóa một tập tin hoặc thư mục trong thư mục hệ thống gốc, bạn cần tạo một tập tin có cùng tên với tập tin/thư mục trong thư mục mô-đun bằng cách sử dụng <code>mknod filename c 0 0</code>. Bằng cách này, hệ thống lớp phủ sẽ tự động &quot;whiteout&quot; (Xóa trắng) tệp này như thể nó đã bị xóa (phân vùng /system không thực sự bị thay đổi).</p><p>Bạn cũng có thể khai báo một biến có tên <code>REMOVE</code> chứa danh sách các thư mục trong <code>customize.sh</code> để thực hiện các thao tác xóa và KernelSU sẽ tự động thực thi <code>mknod &lt;TARGET&gt; c 0 0</code> trong các thư mục tương ứng của mô-đun. Ví dụ:</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">REMOVE</span><span style="color:#F97583;">=</span><span style="color:#9ECBFF;">&quot;</span></span>
<span class="line"><span style="color:#9ECBFF;">/system/app/YouTube</span></span>
<span class="line"><span style="color:#9ECBFF;">/system/app/Bloatware</span></span>
<span class="line"><span style="color:#9ECBFF;">&quot;</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">REMOVE</span><span style="color:#D73A49;">=</span><span style="color:#032F62;">&quot;</span></span>
<span class="line"><span style="color:#032F62;">/system/app/YouTube</span></span>
<span class="line"><span style="color:#032F62;">/system/app/Bloatware</span></span>
<span class="line"><span style="color:#032F62;">&quot;</span></span></code></pre></div><p>Danh sách trên sẽ thực thi <code>mknod $MODPATH/system/app/YouTuBe c 0 0</code> và <code>mknod $MODPATH/system/app/Bloatware c 0 0</code>; và <code>/system/app/YouTube</code> và <code>/system/app/Bloatware</code> sẽ bị xóa sau khi mô-đun này có hiệu lực.</p><p>Nếu bạn muốn thay thế một thư mục trong hệ thống, bạn cần tạo một thư mục có cùng đường dẫn trong thư mục mô-đun của mình, sau đó đặt thuộc tính <code>setfattr -ntrust.overlay.opaque -v y &lt;TARGET&gt;</code> cho thư mục này. Bằng cách này, hệ thống Overlayfs sẽ tự động thay thế thư mục tương ứng trong hệ thống (mà không thay đổi phân vùng /system).</p><p>Bạn có thể khai báo một biến có tên <code>REPLACE</code> trong tệp <code>customize.sh</code> của mình, bao gồm danh sách các thư mục sẽ được thay thế và KernelSU sẽ tự động thực hiện các thao tác tương ứng trong thư mục mô-đun của bạn. Ví dụ:</p><p>REPLACE=&quot; /system/app/YouTube /system/app/Bloatware &quot;</p><p>Danh sách này sẽ tự động tạo các thư mục <code>$MODPATH/system/app/YouTube</code> và <code>$MODPATH/system/app/Bloatware</code>, sau đó thực thi <code>setfattr -ntrusted.overlay.opaque -v y $MODPATH/system/app/ YouTube</code> và <code>setfattr -n Trust.overlay.opaque -v y $MODPATH/system/app/Bloatware</code>. Sau khi mô-đun có hiệu lực, <code>/system/app/YouTube</code> và <code>/system/app/Bloatware</code> sẽ được thay thế bằng các thư mục trống.</p><div class="tip custom-block"><p class="custom-block-title">sự khác biệt với Magisk</p><p>Cơ chế không hệ thống của KernelSU được triển khai thông qua các overlayfs của kernel, trong khi Magisk hiện sử dụng magic mount (bind mount). Hai phương pháp triển khai có những khác biệt đáng kể, nhưng mục tiêu cuối cùng đều giống nhau: sửa đổi các tệp /system mà không sửa đổi vật lý phân vùng /system.</p></div><p>Nếu bạn quan tâm đến overlayfs, bạn nên đọc <a href="https://docs.kernel.org/filesystems/overlayfs.html" target="_blank" rel="noreferrer">documentation on overlayfs</a> của Kernel Linux.</p><h3 id="system-prop" tabindex="-1">system.prop <a class="header-anchor" href="#system-prop" aria-label="Permalink to &quot;system.prop&quot;">​</a></h3><p>Tệp này có cùng định dạng với <code>build.prop</code>. Mỗi dòng bao gồm <code>[key]=[value]</code>.</p><h3 id="sepolicy-rule" tabindex="-1">sepolicy.rule <a class="header-anchor" href="#sepolicy-rule" aria-label="Permalink to &quot;sepolicy.rule&quot;">​</a></h3><p>Nếu mô-đun của bạn yêu cầu một số bản vá lỗi chính sách bổ sung, vui lòng thêm các quy tắc đó vào tệp này. Mỗi dòng trong tệp này sẽ được coi là một tuyên bố chính sách.</p><h2 id="trinh-cai-đat-mo-đun" tabindex="-1">Trình cài đặt mô-đun <a class="header-anchor" href="#trinh-cai-đat-mo-đun" aria-label="Permalink to &quot;Trình cài đặt mô-đun&quot;">​</a></h2><p>Trình cài đặt mô-đun KernelSU là mô-đun KernelSU được đóng gói trong tệp zip có thể được flash trong APP KernelSU manager. Trình cài đặt mô-đun KernelSU đơn giản chỉ là mô-đun KernelSU được đóng gói dưới dạng tệp zip.</p><div class="language-txt vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">txt</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">module.zip</span></span>
<span class="line"><span style="color:#e1e4e8;">│</span></span>
<span class="line"><span style="color:#e1e4e8;">├── customize.sh                       &lt;--- (Tùy chọn, biết thêm chi tiết sau)</span></span>
<span class="line"><span style="color:#e1e4e8;">│                                           Tập lệnh này sẽ có nguồn gốc từ update-binary</span></span>
<span class="line"><span style="color:#e1e4e8;">├── ...</span></span>
<span class="line"><span style="color:#e1e4e8;">├── ...  /* Các tập tin còn lại của mô-đun */</span></span>
<span class="line"><span style="color:#e1e4e8;">│</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">module.zip</span></span>
<span class="line"><span style="color:#24292e;">│</span></span>
<span class="line"><span style="color:#24292e;">├── customize.sh                       &lt;--- (Tùy chọn, biết thêm chi tiết sau)</span></span>
<span class="line"><span style="color:#24292e;">│                                           Tập lệnh này sẽ có nguồn gốc từ update-binary</span></span>
<span class="line"><span style="color:#24292e;">├── ...</span></span>
<span class="line"><span style="color:#24292e;">├── ...  /* Các tập tin còn lại của mô-đun */</span></span>
<span class="line"><span style="color:#24292e;">│</span></span></code></pre></div><div class="warning custom-block"><p class="custom-block-title">WARNING</p><p>Mô-đun KernelSU KHÔNG được hỗ trợ để cài đặt trong khôi phục tùy chỉnh!!</p></div><h3 id="tuy-chinh" tabindex="-1">Tùy chỉnh <a class="header-anchor" href="#tuy-chinh" aria-label="Permalink to &quot;Tùy chỉnh&quot;">​</a></h3><p>Nếu bạn cần tùy chỉnh quá trình cài đặt mô-đun, bạn có thể tùy ý tạo một tập lệnh trong trình cài đặt có tên <code>customize.sh</code>. Tập lệnh này sẽ được <em>sourced</em> (không được thực thi!) bởi tập lệnh cài đặt mô-đun sau khi tất cả các tệp được trích xuất và các quyền mặc định cũng như văn bản thứ hai được áp dụng. Điều này rất hữu ích nếu mô-đun của bạn yêu cầu thiết lập bổ sung dựa trên ABI của thiết bị hoặc bạn cần đặt các quyền/văn bản thứ hai đặc biệt cho một số tệp mô-đun của mình.</p><p>Nếu bạn muốn kiểm soát và tùy chỉnh hoàn toàn quá trình cài đặt, hãy khai báo <code>SKIPUNZIP=1</code> trong <code>customize.sh</code> để bỏ qua tất cả các bước cài đặt mặc định. Bằng cách đó, <code>customize.sh</code> của bạn sẽ chịu trách nhiệm cài đặt mọi thứ.</p><p>Tập lệnh <code>customize.sh</code> chạy trong shell <code>ash</code> BusyBox của KernelSU với &quot;Chế độ độc lập&quot; được bật. Có sẵn các biến và hàm sau:</p><h4 id="bien" tabindex="-1">Biến <a class="header-anchor" href="#bien" aria-label="Permalink to &quot;Biến&quot;">​</a></h4><ul><li><code>KSU</code> (bool): biến để đánh dấu script đang chạy trong môi trường KernelSU, và giá trị của biến này sẽ luôn đúng. Bạn có thể sử dụng nó để phân biệt giữa KernelSU và Magisk.</li><li><code>KSU_VER</code> (chuỗi): chuỗi phiên bản của KernelSU được cài đặt hiện tại (ví dụ: <code>v0.4.0</code>)</li><li><code>KSU_VER_CODE</code> (int): mã phiên bản của KernelSU được cài đặt hiện tại trong không gian người dùng (ví dụ: <code>10672</code>)</li><li><code>KSU_KERNEL_VER_CODE</code> (int): mã phiên bản của KernelSU được cài đặt hiện tại trong không gian kernel (ví dụ: <code>10672</code>)</li><li><code>BOOTMODE</code> (bool): luôn là <code>true</code> trong KernelSU</li><li><code>MODPATH</code> (đường dẫn): đường dẫn nơi các tập tin mô-đun của bạn sẽ được cài đặt</li><li><code>TMPDIR</code> (đường dẫn): nơi bạn có thể lưu trữ tạm thời các tập tin</li><li><code>ZIPFILE</code> (đường dẫn): zip cài đặt mô-đun của bạn</li><li><code>ARCH</code> (chuỗi): kiến trúc CPU của thiết bị. Giá trị là <code>arm</code>, <code>arm64</code>, <code>x86</code> hoặc <code>x64</code></li><li><code>IS64BIT</code> (bool): <code>true</code> nếu <code>$ARCH</code> là <code>arm64</code> hoặc <code>x64</code></li><li><code>API</code> (int): cấp độ API (phiên bản Android) của thiết bị (ví dụ: <code>23</code> cho Android 6.0)</li></ul><div class="warning custom-block"><p class="custom-block-title">WARNING</p><p>Trong KernelSU, MAGISK_VER_CODE luôn là 25200 và MAGISK_VER luôn là v25.2. Vui lòng không sử dụng hai biến này để xác định xem nó có chạy trên KernelSU hay không.</p></div><h4 id="ham" tabindex="-1">Hàm <a class="header-anchor" href="#ham" aria-label="Permalink to &quot;Hàm&quot;">​</a></h4><div class="language-txt vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">txt</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">ui_print &lt;msg&gt;</span></span>
<span class="line"><span style="color:#e1e4e8;">    in &lt;msg&gt; ra console</span></span>
<span class="line"><span style="color:#e1e4e8;">    Tránh sử dụng &#39;echo&#39; vì nó sẽ không hiển thị trong console của recovery tùy chỉnh</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">abort &lt;msg&gt;</span></span>
<span class="line"><span style="color:#e1e4e8;">    in thông báo lỗi &lt;msg&gt; ra bàn điều khiển và chấm dứt cài đặt</span></span>
<span class="line"><span style="color:#e1e4e8;">    Tránh sử dụng &#39;exit&#39; vì nó sẽ bỏ qua các bước dọn dẹp chấm dứt</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">set_perm &lt;target&gt; &lt;owner&gt; &lt;group&gt; &lt;permission&gt; [context]</span></span>
<span class="line"><span style="color:#e1e4e8;">    nếu [context] không được đặt, mặc định là &quot;u:object_r:system_file:s0&quot;</span></span>
<span class="line"><span style="color:#e1e4e8;">    chức năng này là một shorthand cho các lệnh sau:</span></span>
<span class="line"><span style="color:#e1e4e8;">       chown owner.group target</span></span>
<span class="line"><span style="color:#e1e4e8;">       chmod permission target</span></span>
<span class="line"><span style="color:#e1e4e8;">       chcon context target</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">set_perm_recursive &lt;directory&gt; &lt;owner&gt; &lt;group&gt; &lt;dirpermission&gt; &lt;filepermission&gt; [context]</span></span>
<span class="line"><span style="color:#e1e4e8;">    nếu [context] không được đặt, mặc định là &quot;u:object_r:system_file:s0&quot;</span></span>
<span class="line"><span style="color:#e1e4e8;">    đối với tất cả các tệp trong &lt;directory&gt;, nó sẽ gọi:</span></span>
<span class="line"><span style="color:#e1e4e8;">       bối cảnh cấp phép tệp của nhóm chủ sở hữu tệp set_perm</span></span>
<span class="line"><span style="color:#e1e4e8;">    đối với tất cả các thư mục trong &lt;directory&gt; (bao gồm cả chính nó), nó sẽ gọi:</span></span>
<span class="line"><span style="color:#e1e4e8;">       set_perm bối cảnh phân quyền của nhóm chủ sở hữu thư mục</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">ui_print &lt;msg&gt;</span></span>
<span class="line"><span style="color:#24292e;">    in &lt;msg&gt; ra console</span></span>
<span class="line"><span style="color:#24292e;">    Tránh sử dụng &#39;echo&#39; vì nó sẽ không hiển thị trong console của recovery tùy chỉnh</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">abort &lt;msg&gt;</span></span>
<span class="line"><span style="color:#24292e;">    in thông báo lỗi &lt;msg&gt; ra bàn điều khiển và chấm dứt cài đặt</span></span>
<span class="line"><span style="color:#24292e;">    Tránh sử dụng &#39;exit&#39; vì nó sẽ bỏ qua các bước dọn dẹp chấm dứt</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">set_perm &lt;target&gt; &lt;owner&gt; &lt;group&gt; &lt;permission&gt; [context]</span></span>
<span class="line"><span style="color:#24292e;">    nếu [context] không được đặt, mặc định là &quot;u:object_r:system_file:s0&quot;</span></span>
<span class="line"><span style="color:#24292e;">    chức năng này là một shorthand cho các lệnh sau:</span></span>
<span class="line"><span style="color:#24292e;">       chown owner.group target</span></span>
<span class="line"><span style="color:#24292e;">       chmod permission target</span></span>
<span class="line"><span style="color:#24292e;">       chcon context target</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">set_perm_recursive &lt;directory&gt; &lt;owner&gt; &lt;group&gt; &lt;dirpermission&gt; &lt;filepermission&gt; [context]</span></span>
<span class="line"><span style="color:#24292e;">    nếu [context] không được đặt, mặc định là &quot;u:object_r:system_file:s0&quot;</span></span>
<span class="line"><span style="color:#24292e;">    đối với tất cả các tệp trong &lt;directory&gt;, nó sẽ gọi:</span></span>
<span class="line"><span style="color:#24292e;">       bối cảnh cấp phép tệp của nhóm chủ sở hữu tệp set_perm</span></span>
<span class="line"><span style="color:#24292e;">    đối với tất cả các thư mục trong &lt;directory&gt; (bao gồm cả chính nó), nó sẽ gọi:</span></span>
<span class="line"><span style="color:#24292e;">       set_perm bối cảnh phân quyền của nhóm chủ sở hữu thư mục</span></span></code></pre></div><h2 id="tap-lenh-khoi-đong" tabindex="-1">Tập lệnh khởi động <a class="header-anchor" href="#tap-lenh-khoi-đong" aria-label="Permalink to &quot;Tập lệnh khởi động&quot;">​</a></h2><p>Trong KernelSU, tập lệnh được chia thành hai loại dựa trên chế độ chạy của chúng: chế độ post-fs-data và chế độ dịch vụ late_start:</p><ul><li>chế độ post-fs-data <ul><li>Giai đoạn này là BLOCKING. Quá trình khởi động bị tạm dừng trước khi thực thi xong hoặc đã trôi qua 10 giây.</li><li>Các tập lệnh chạy trước khi bất kỳ mô-đun nào được gắn kết. Điều này cho phép nhà phát triển mô-đun tự động điều chỉnh các mô-đun của họ trước khi nó được gắn kết.</li><li>Giai đoạn này xảy ra trước khi Zygote được khởi động, điều này gần như có ý nghĩa đối với mọi thứ trong Android</li><li><strong>CẢNH BÁO:</strong> sử dụng <code>setprop</code> sẽ làm quá trình khởi động bị nghẽn! Thay vào đó, vui lòng sử dụng <code>resetprop -n &lt;prop_name&gt; &lt;prop_value&gt;</code>.</li><li><strong>Chỉ chạy tập lệnh ở chế độ này nếu cần thiết.</strong></li></ul></li><li>chế độ dịch vụ late_start <ul><li>Giai đoạn này là NON-BLOCKING. Tập lệnh của bạn chạy song song với phần còn lại của quá trình khởi động.</li><li><strong>Đây là giai đoạn được khuyến nghị để chạy hầu hết các tập lệnh.</strong></li></ul></li></ul><p>Trong KernelSU, tập lệnh khởi động được chia thành hai loại dựa trên vị trí lưu trữ của chúng: tập lệnh chung và tập lệnh mô-đun:</p><ul><li>Kịch Bản Chung <ul><li>Được đặt trong <code>/data/adb/post-fs-data.d</code>, <code>/data/adb/service.d</code>, <code>/data/adb/post-mount.d</code> hoặc <code>/data/adb/boot- đã hoàn thành.d</code></li><li>Chỉ được thực thi nếu tập lệnh được đặt là có thể thực thi được (<code>chmod +x script.sh</code>)</li><li>Các tập lệnh trong <code>post-fs-data.d</code> chạy ở chế độ post-fs-data và các tập lệnh trong <code>service.d</code> chạy ở chế độ dịch vụ late_start.</li><li>Các mô-đun <strong>KHÔNG</strong> thêm các tập lệnh chung trong quá trình cài đặt</li></ul></li><li>Tập Lệnh Mô-đun <ul><li>Được đặt trong thư mục riêng của mô-đun</li><li>Chỉ thực hiện nếu mô-đun được kích hoạt</li><li><code>post-fs-data.sh</code> chạy ở chế độ post-fs-data, <code>service.sh</code> chạy ở chế độ dịch vụ late_start, <code>boot-completed.sh</code> chạy khi khởi động xong, <code>post-mount.sh</code> chạy trên overlayfs được gắn kết.</li></ul></li></ul><p>Tất cả các tập lệnh khởi động sẽ chạy trong shell <code>ash</code> BusyBox của KernelSU với &quot;Standalone Mode&quot; được bật.</p>`,58),l=[c];function o(p,i,h,r,g,d){return s(),e("div",null,l)}const m=n(t,[["render",o]]);export{y as __pageData,m as default};
