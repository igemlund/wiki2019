<h1>iGEM Lund wiki 2019</h1>

<h2>Editing guide</h2>
<p>This is a guide for anyone in the team who wants to make edits to the wiki. If you want to edit layout or make other extensive edits you will have to clone the github repo using git. Then run "npm install in order to download the required packages. Then run "npm start" in order to start the dev-server.</p>

<h3>I want edit an existing page... (without having to download or install any software)</h3>

<h4>...and it is urgent.</h4>
<ol>
    <li>Visit the <a href="https://2019.igem.org/Team:Lund">wiki </a> and navigate to the page you want to edit.</li>
    <li>Sign in and press "wiki tools" and then "Edit".</li>
    <li>Edit the html code. You can press "preview" to make sure you did't make any mistakes.</li>
    <li>Press "Save" to save your edits.</li>
    <li>In order not to have your edits overwritten when someone updates the pages with new code fro github, it is important that you edit the corresponding page on github aswell. Go to the corresponding page in <a href="https://github.com/igemlund/wiki2019/tree/master/app/pages">app/pages/</a></li>
    <li>To edit the file, press the small pen in the upper right corner. Make the same edits you made at <a href="https://2019.igem.org/Team:Lund">wiki </a>. Do NOT copy/paste the whole page.</li>
<li>To save your edits, press the button labeled "Commit changes".</li>
</ol>

<h4>...and it is NOT urgent.</h4>
<ol>
    <li> Go to the page you want to edit in <a href="https://github.com/igemlund/wiki2019/tree/master/app/pages">app/pages/</a></li>
    <li>To edit the file, press the small pen in the upper right corner.</li>
    <li>To save your edits, press the button labeled "Commit changes".</li>
    <li>Your edits will show up on the wiki whenever someone updates the whole page.</li>
</ol>

<h3>I want to add a new page</h3>
<ol>
    <li>Go to the pages folder <a href="https://github.com/igemlund/wiki2019/tree/master/app/pages">app/pages/</a></li>
    <li>Press "Create new file".</li>
    <li>Copy/past the contents from a similar file in <a href="https://github.com/igemlund/wiki2019/tree/master/app/pages">app/pages/</a>.</li>
    <li>To save your edits, press the button labeled "Commit changes".</li>
</ol>

<h3>I want to update an existing figure.</h3>
<ol>
    <li>Find the figure you want to update, right click and press "open in new tab", you will find the name of the image in the address-bar. It will be called T--Lund--xxxxx.xxx. Where xxxxxxx.xx is the name of the file.</li>
    <li>Go to https://2019.igem.org/File:T--Lund--xxxxxxxx</li>
    <li>Press the link called "Update a new version of this file"</li>
    <li>Select new version of the file and press "Upload file".</li>
</ol>

<h3>I want make edits files using a local dev-server.</h3>
<ol>
    <li>Install git and npm.</li>
    <li>Clone the repo using git: git clone https://github.com/igemlund/wiki2019.</li>
    <li>Navigate to the folder wiki2019: cd wiki2019.</li>
    <li>Install required packages: npm install.</li>
    <li>Start dev-server: npm start.</li>
    <li>Edit the files you want to.</li>
    <li>Don't forget to commit you changes.</li>
</ol>

