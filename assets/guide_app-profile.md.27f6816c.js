import{_ as e,o as s,c as o,Q as a}from"./chunks/framework.ec8f7e8e.js";const E=JSON.parse('{"title":"App Profile","description":"","frontmatter":{},"headers":[],"relativePath":"guide/app-profile.md","filePath":"guide/app-profile.md"}'),n={name:"guide/app-profile.md"},t=a(`<h1 id="app-profile" tabindex="-1">App Profile <a class="header-anchor" href="#app-profile" aria-label="Permalink to &quot;App Profile&quot;">​</a></h1><p>The App Profile is a mechanism provided by KernelSU for customizing the configuration of various applications.</p><p>For applications granted root permissions (i.e., able to use <code>su</code>), the App Profile can also be referred to as the Root Profile. It allows customization of the <code>uid</code>, <code>gid</code>, <code>groups</code>, <code>capabilities</code>, and <code>SELinux</code> rules of the <code>su</code> command, thereby restricting the privileges of the root user. For example, it can grant network permissions only to firewall applications while denying file access permissions, or it can grant shell permissions instead of full root access for freeze applications: <strong>keeping the power confined with the principle of least privilege.</strong></p><p>For ordinary applications without root permissions, the App Profile can control the behavior of the kernel and module system towards these applications. For instance, it can determine whether modifications resulting from modules should be addressed. The kernel and module system can make decisions based on this configuration, such as performing operations akin to &quot;hiding&quot;</p><h2 id="root-profile" tabindex="-1">Root Profile <a class="header-anchor" href="#root-profile" aria-label="Permalink to &quot;Root Profile&quot;">​</a></h2><h3 id="uid-gid-and-groups" tabindex="-1">UID, GID, and Groups <a class="header-anchor" href="#uid-gid-and-groups" aria-label="Permalink to &quot;UID, GID, and Groups&quot;">​</a></h3><p>Linux systems have two concepts: users and groups. Each user has a user ID (UID), and a user can belong to multiple groups, each with its own group ID (GID). These IDs are used to identify users in the system and determine which system resources they can access.</p><p>Users with a UID of 0 are known as root users, and groups with a GID of 0 are known as root groups. The root user group typically holds the highest system privileges.</p><p>In the case of the Android system, each app is a separate user (excluding shared UID scenarios) with a unique UID. For example, <code>0</code> represents the root user, <code>1000</code> represents <code>system</code>, <code>2000</code> represents the ADB shell, and UIDs ranging from 10000 to 19999 represent ordinary apps.</p><div class="info custom-block"><p class="custom-block-title">INFO</p><p>Here, the UID mentioned is not the same as the concept of multiple users or work profiles in the Android system. Work profiles are actually implemented by partitioning the UID range. For example, 10000-19999 represents the main user, while 110000-119999 represents a work profile. Each ordinary app among them has its own unique UID.</p></div><p>Each app can have several groups, with the GID representing the primary group, which usually matches the UID. Other groups are known as supplementary groups. Certain permissions are controlled through groups, such as network access permissions or Bluetooth access.</p><p>For example, if we execute the <code>id</code> command in ADB shell, the output might look like this:</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#B392F0;">oriole:/</span><span style="color:#E1E4E8;"> $ </span><span style="color:#9ECBFF;">id</span></span>
<span class="line"><span style="color:#E1E4E8;">uid</span><span style="color:#F97583;">=</span><span style="color:#79B8FF;">2000</span><span style="color:#E1E4E8;">(</span><span style="color:#B392F0;">shell</span><span style="color:#E1E4E8;">) gid</span><span style="color:#F97583;">=</span><span style="color:#79B8FF;">2000</span><span style="color:#E1E4E8;">(</span><span style="color:#B392F0;">shell</span><span style="color:#E1E4E8;">) groups</span><span style="color:#F97583;">=</span><span style="color:#79B8FF;">2000</span><span style="color:#E1E4E8;">(</span><span style="color:#B392F0;">shell</span><span style="color:#E1E4E8;">)</span><span style="color:#9ECBFF;">,1004</span><span style="color:#E1E4E8;">(</span><span style="color:#B392F0;">input</span><span style="color:#E1E4E8;">)</span><span style="color:#9ECBFF;">,1007</span><span style="color:#E1E4E8;">(</span><span style="color:#B392F0;">log</span><span style="color:#E1E4E8;">)</span><span style="color:#9ECBFF;">,1011</span><span style="color:#E1E4E8;">(</span><span style="color:#B392F0;">adb</span><span style="color:#E1E4E8;">)</span><span style="color:#9ECBFF;">,1015</span><span style="color:#E1E4E8;">(</span><span style="color:#B392F0;">sdcard_rw</span><span style="color:#E1E4E8;">)</span><span style="color:#9ECBFF;">,1028</span><span style="color:#E1E4E8;">(</span><span style="color:#B392F0;">sdcard_r</span><span style="color:#E1E4E8;">)</span><span style="color:#9ECBFF;">,1078</span><span style="color:#E1E4E8;">(</span><span style="color:#B392F0;">ext_data_rw</span><span style="color:#E1E4E8;">)</span><span style="color:#9ECBFF;">,1079</span><span style="color:#E1E4E8;">(</span><span style="color:#B392F0;">ext_obb_rw</span><span style="color:#E1E4E8;">)</span><span style="color:#9ECBFF;">,3001</span><span style="color:#E1E4E8;">(</span><span style="color:#B392F0;">net_bt_admin</span><span style="color:#E1E4E8;">)</span><span style="color:#9ECBFF;">,3002</span><span style="color:#E1E4E8;">(</span><span style="color:#B392F0;">net_bt</span><span style="color:#E1E4E8;">)</span><span style="color:#9ECBFF;">,3003</span><span style="color:#E1E4E8;">(</span><span style="color:#B392F0;">inet</span><span style="color:#E1E4E8;">)</span><span style="color:#9ECBFF;">,3006</span><span style="color:#E1E4E8;">(</span><span style="color:#B392F0;">net_bw_stats</span><span style="color:#E1E4E8;">)</span><span style="color:#9ECBFF;">,3009</span><span style="color:#E1E4E8;">(</span><span style="color:#B392F0;">readproc</span><span style="color:#E1E4E8;">)</span><span style="color:#9ECBFF;">,3011</span><span style="color:#E1E4E8;">(</span><span style="color:#B392F0;">uhid</span><span style="color:#E1E4E8;">)</span><span style="color:#9ECBFF;">,3012</span><span style="color:#E1E4E8;">(</span><span style="color:#B392F0;">readtracefs</span><span style="color:#E1E4E8;">) context</span><span style="color:#F97583;">=</span><span style="color:#9ECBFF;">u:r:shell:s0</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6F42C1;">oriole:/</span><span style="color:#24292E;"> $ </span><span style="color:#032F62;">id</span></span>
<span class="line"><span style="color:#24292E;">uid</span><span style="color:#D73A49;">=</span><span style="color:#005CC5;">2000</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">shell</span><span style="color:#24292E;">) gid</span><span style="color:#D73A49;">=</span><span style="color:#005CC5;">2000</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">shell</span><span style="color:#24292E;">) groups</span><span style="color:#D73A49;">=</span><span style="color:#005CC5;">2000</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">shell</span><span style="color:#24292E;">)</span><span style="color:#032F62;">,1004</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">input</span><span style="color:#24292E;">)</span><span style="color:#032F62;">,1007</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">log</span><span style="color:#24292E;">)</span><span style="color:#032F62;">,1011</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">adb</span><span style="color:#24292E;">)</span><span style="color:#032F62;">,1015</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">sdcard_rw</span><span style="color:#24292E;">)</span><span style="color:#032F62;">,1028</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">sdcard_r</span><span style="color:#24292E;">)</span><span style="color:#032F62;">,1078</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">ext_data_rw</span><span style="color:#24292E;">)</span><span style="color:#032F62;">,1079</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">ext_obb_rw</span><span style="color:#24292E;">)</span><span style="color:#032F62;">,3001</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">net_bt_admin</span><span style="color:#24292E;">)</span><span style="color:#032F62;">,3002</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">net_bt</span><span style="color:#24292E;">)</span><span style="color:#032F62;">,3003</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">inet</span><span style="color:#24292E;">)</span><span style="color:#032F62;">,3006</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">net_bw_stats</span><span style="color:#24292E;">)</span><span style="color:#032F62;">,3009</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">readproc</span><span style="color:#24292E;">)</span><span style="color:#032F62;">,3011</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">uhid</span><span style="color:#24292E;">)</span><span style="color:#032F62;">,3012</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">readtracefs</span><span style="color:#24292E;">) context</span><span style="color:#D73A49;">=</span><span style="color:#032F62;">u:r:shell:s0</span></span></code></pre></div><p>Here, the UID is <code>2000</code>, and the GID (primary group ID) is also <code>2000</code>. Additionally, it belongs to several supplementary groups, such as <code>inet</code> (indicating the ability to create <code>AF_INET</code> and <code>AF_INET6</code> sockets) and <code>sdcard_rw</code> (indicating read/write permissions for the SD card).</p><p>KernelSU&#39;s Root Profile allows customization of the UID, GID, and groups for the root process after executing <code>su</code>. For example, the Root Profile of a root app can set its UID to <code>2000</code>, which means that when using <code>su</code>, the app&#39;s actual permissions are at the ADB shell level. The <code>inet</code> group can be removed, preventing the <code>su</code> command from accessing the network.</p><div class="tip custom-block"><p class="custom-block-title">Note</p><p>The App Profile only controls the permissions of the root process after using <code>su</code>; it does not control the permissions of the app itself. If an app has requested network access permission, it can still access the network even without using <code>su</code>. Removing the <code>inet</code> group from <code>su</code> only prevents <code>su</code> from accessing the network.</p></div><p>Root Profile is enforced in the kernel and does not rely on the voluntary behavior of root applications, unlike switching users or groups through <code>su</code>, the granting of <code>su</code> permission is entirely up to the user rather than the developer.</p><h3 id="capabilities" tabindex="-1">Capabilities <a class="header-anchor" href="#capabilities" aria-label="Permalink to &quot;Capabilities&quot;">​</a></h3><p>Capabilities are a mechanism for privilege separation in Linux.</p><p>For the purpose of performing permission checks, traditional UNIX implementations distinguish two categories of processes: privileged processes (whose effective user ID is 0, referred to as superuser or root), and unprivileged processes (whose effective UID is nonzero). Privileged processes bypass all kernel permission checks, while unprivileged processes are subject to full permission checking based on the process&#39;s credentials (usually: effective UID, effective GID, and supplementary group list).</p><p>Starting with Linux 2.2, Linux divides the privileges traditionally associated with superuser into distinct units, known as capabilities, which can be independently enabled and disabled.</p><p>Each Capability represents one or more privileges. For example, <code>CAP_DAC_READ_SEARCH</code> represents the ability to bypass permission checks for file reading, as well as directory reading and execution permissions. If a user with an effective UID of <code>0</code> (root user) lacks <code>CAP_DAC_READ_SEARCH</code> or higher capabilities, this means that even though they are root, they cannot read files at will.</p><p>KernelSU&#39;s Root Profile allows customization of the Capabilities of the root process after executing <code>su</code>, thereby achieving partially granting &quot;root permissions.&quot; Unlike the aforementioned UID and GID, certain root apps require a UID of <code>0</code> after using <code>su</code>. In such cases, limiting the Capabilities of this root user with UID <code>0</code> can restrict their allowed operations.</p><div class="tip custom-block"><p class="custom-block-title">Strong Recommendation</p><p>Linux&#39;s Capability <a href="https://man7.org/linux/man-pages/man7/capabilities.7.html" target="_blank" rel="noreferrer">official documentation</a> provides detailed explanations of the abilities represented by each Capability. If you intend to customize Capabilities, it is strongly recommended that you read this document first.</p></div><h3 id="selinux" tabindex="-1">SELinux <a class="header-anchor" href="#selinux" aria-label="Permalink to &quot;SELinux&quot;">​</a></h3><p>SELinux is a powerful Mandatory Access Control (MAC) mechanism. It operates on the principle of <strong>default deny</strong>: any action not explicitly allowed is denied.</p><p>SELinux can run in two global modes:</p><ol><li>Permissive mode: Denial events are logged but not enforced.</li><li>Enforcing mode: Denial events are logged and enforced.</li></ol><div class="warning custom-block"><p class="custom-block-title">Warning</p><p>Modern Android systems heavily rely on SELinux to ensure overall system security. It is highly recommended not to use any custom systems running in &quot;permissive mode&quot; since it provides no significant advantages over a completely open system.</p></div><p>Explaining the full concept of SELinux is complex and beyond the scope of this document. It is recommended to first understand its workings through the following resources:</p><ol><li><a href="https://en.wikipedia.org/wiki/Security-Enhanced_Linux" target="_blank" rel="noreferrer">Wikipedia</a></li><li><a href="https://www.redhat.com/en/topics/linux/what-is-selinux" target="_blank" rel="noreferrer">Red Hat: What Is SELinux?</a></li><li><a href="https://wiki.archlinux.org/title/SELinux" target="_blank" rel="noreferrer">ArchLinux: SELinux</a></li></ol><p>KernelSU&#39;s Root Profile allows customization of the SELinux context of the root process after executing <code>su</code>. Specific access control rules can be set for this context to enable fine-grained control over root permissions.</p><p>In typical scenarios, when an app executes <code>su</code>, it switches the process to a SELinux domain with <strong>unrestricted access</strong>, such as <code>u:r:su:s0</code>. Through the Root Profile, this domain can be switched to a custom domain, such as <code>u:r:app1:s0</code>, and a series of rules can be defined for this domain:</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#79B8FF;">type</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">app1</span></span>
<span class="line"><span style="color:#B392F0;">enforce</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">app1</span></span>
<span class="line"><span style="color:#B392F0;">typeattribute</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">app1</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">mlstrustedsubject</span></span>
<span class="line"><span style="color:#B392F0;">allow</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">app1</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">*</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">*</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">*</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#005CC5;">type</span><span style="color:#24292E;"> </span><span style="color:#032F62;">app1</span></span>
<span class="line"><span style="color:#6F42C1;">enforce</span><span style="color:#24292E;"> </span><span style="color:#032F62;">app1</span></span>
<span class="line"><span style="color:#6F42C1;">typeattribute</span><span style="color:#24292E;"> </span><span style="color:#032F62;">app1</span><span style="color:#24292E;"> </span><span style="color:#032F62;">mlstrustedsubject</span></span>
<span class="line"><span style="color:#6F42C1;">allow</span><span style="color:#24292E;"> </span><span style="color:#032F62;">app1</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">*</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">*</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">*</span></span></code></pre></div><p>Note that the <code>allow app1 * * *</code> rule is used for demonstration purposes only. In practice, this rule should not be used extensively since it doesn&#39;t differ much from permissive mode.</p><h3 id="escalation" tabindex="-1">Escalation <a class="header-anchor" href="#escalation" aria-label="Permalink to &quot;Escalation&quot;">​</a></h3><p>If the configuration of the Root Profile is not set properly, an escalation scenario may occur: the restrictions imposed by the Root Profile can unintentionally fail.</p><p>For example, if you grant root permission to an ADB shell user (which is a common case), and then you grant root permission to a regular application but configure its root profile with UID 2000 (which is the UID of the ADB shell user), the application can obtain full root access by executing the <code>su</code> command twice:</p><ol><li>The first <code>su</code> execution is subject to the enforcement of the App Profile and will switch to UID <code>2000</code> (adb shell) instead of <code>0</code> (root).</li><li>The second <code>su</code> execution, since the UID is <code>2000</code>, and you have granted root access to the UID <code>2000</code> (adb shell) in the configuration, the application will gain full root privileges.</li></ol><div class="warning custom-block"><p class="custom-block-title">Note</p><p>This behavior is entirely expected and not a bug. Therefore, we recommend the following:</p><p>If you genuinely need to grant root permissions to ADB (e.g., as a developer), it is not advisable to change the UID to <code>2000</code> when configuring the Root Profile. Using <code>1000</code> (system) would be a better choice.</p></div><h2 id="non-root-profile" tabindex="-1">Non-Root Profile <a class="header-anchor" href="#non-root-profile" aria-label="Permalink to &quot;Non-Root Profile&quot;">​</a></h2><h3 id="umount-modules" tabindex="-1">Umount Modules <a class="header-anchor" href="#umount-modules" aria-label="Permalink to &quot;Umount Modules&quot;">​</a></h3><p>KernelSU provides a systemless mechanism for modifying system partitions, achieved through overlayfs mounting. However, some apps may be sensitive to such behavior. Thus, we can unload modules mounted on these apps by setting the &quot;umount modules&quot; option.</p><p>Additionally, the settings interface of the KernelSU manager provides a switch for &quot;umount modules by default&quot;. By default, this switch is <strong>enabled</strong>, which means that KernelSU or some modules will unload modules for this app unless additional settings are applied. If you do not prefer this setting or if it affects certain apps, you have the following options:</p><ol><li>Keep the switch for &quot;umount modules by default&quot; and individually disable the &quot;umount modules&quot; option in the App Profile for apps requiring module loading (acting as a &quot;whitelist&quot;).</li><li>Disable the switch for &quot;umount modules by default&quot; and individually enable the &quot;umount modules&quot; option in the App Profile for apps requiring module unloading (acting as a &quot;blacklist&quot;).</li></ol><div class="info custom-block"><p class="custom-block-title">INFO</p><p>In devices using kernel version 5.10 and above, the kernel performs the unloading of modules. However, for devices running kernel versions below 5.10, this switch is merely a configuration option, and KernelSU itself does not take any action. Some modules, such as Zygisksu, may use this switch to determine whether module unloading is necessary.</p></div>`,46),l=[t];function p(r,i,c,d,u,h){return s(),o("div",null,l)}const m=e(n,[["render",p]]);export{E as __pageData,m as default};
