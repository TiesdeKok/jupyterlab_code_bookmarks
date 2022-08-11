<h1 align="center">
    JupyterLab Code Bookmarks<br>   
</h1>
<p align="center">  
 <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/license-MIT-blue.svg"></a>
  <img src="https://img.shields.io/badge/last%20updated-August%202022-3d62d1">
 
</p>

<p align="center">
A JupyterLab extension that adds code bookmark functionality, similar to the <a href="https://marketplace.visualstudio.com/items?itemName=alefragnani.Bookmarks">bookmarks</a> VSCode extension.<br>
<br>
  <span style='font-size: 15pt'><strong>Author:</strong> Ties de Kok (<a href="https://www.TiesdeKok.com">Personal Page</a>)</span>
</p>

## Table of contents

  * [Introduction](#introduction)
  * [Installation](#installation)
  * [How to use](#howtouse)
      * [Basic operations](#basic-operations)
      * [Configuration options](#configuration)
  * [Questions?](#questions)
  * [Known bugs and features in development](#in-progress)
  * [License](#license)

<h2 id="introduction">Introduction</h2>
 
![code_bookmarks_demo_v1](https://user-images.githubusercontent.com/13317782/183809039-0203aec0-ff1d-4916-8642-f58cb5c785ad.gif)

<h2 id="installation">Installation</h2>

**Note:** `jupyterlab-code-bookmarks` requires JupyterLab 3+

```bash
pip install jupyterlab-code-bookmarks
```
<h2 id="howtouse">How to use</h2>

<h3 id="basic-operations">Basic operations</h3>

<h4>Setting / Removing a bookmark</h4>

You can set or remove a bookmark by right clicking a cell and pressing "Toggle bookmark".     
Or by using the keyboard shortcut `CTRL + ALT + K`.

*Note:* Bookmarks persist when saving/loading the notebook. 

<h4>Jumping to bookmark</h4>

You can jump to the previous or next bookmark by clicking the jump buttons in the toolbar.     
Or by using the keyboard shortcuts:

- `CTRL + ALT + J` to jump forward
- `CTRL + ALT + L` to jump backward

<h3 id="configuration">Configuration options</h3>

<h4>Changing keyboard shortcuts</h4>

You can change the keyboard shortcuts through the JupyterLab keyboard shortcuts settings.

<h2 id="questions">Questions?</h2>

If you have questions or experience problems please use the `issues` tab of this repository.

<h2 id="in-progress">Known bugs and features in progress</h2>

- [ ] Copy and pasting a cell works, however, bookmark styling is not applied until webpage refresh.   
- [x] Jumping to a markdown cells does not always move the cell into view.
- [ ] Enable customization of the cell bookmark color.    
- [ ] Make toolbar jump icons take up less space using icons.   
- [ ] Add basic tests.   

<h2 id="license">License</h2>

[MIT](LICENSE) - Ties de Kok - 2022
