/* -------------------------------------------------------------------------- */
/*                                   Imports                                  */
/* -------------------------------------------------------------------------- */

import { IDisposable, DisposableDelegate } from '@lumino/disposable';

import {
    JupyterFrontEnd,
    JupyterFrontEndPlugin,
} from '@jupyterlab/application';

import { ToolbarButton } from '@jupyterlab/apputils';
import { DocumentRegistry } from '@jupyterlab/docregistry';

import { LabIcon } from '@jupyterlab/ui-components';
import jumpSvg from '../style/icons/jump.svg';

import {
    NotebookPanel,
    INotebookModel,
    INotebookTracker
} from '@jupyterlab/notebook';

/* -------------------------------------------------------------------------- */
/*                    Hard coded parameters for development                   */
/* -------------------------------------------------------------------------- */

const VERBOSE = 0;

/* -------------------------------------------------------------------------- */
/*                                    Logic                                   */
/* -------------------------------------------------------------------------- */

/* -------------------------- Toggle functionality -------------------------- */

function toggleBookmark(notebookTracker : INotebookTracker){
    var notebook = notebookTracker.currentWidget!.content;
    const activeCell = notebook.activeCell!;
    const hasBookmark = activeCell.model.metadata.has('bookmarked') || false;

    if (!hasBookmark) {
        if (VERBOSE > 0){console.log('Setting bookmark');}
        activeCell.model.metadata.set('bookmarked', true);
        activeCell.node.classList.add('bookmarked');
    } else {
        if (VERBOSE > 0){console.log('Removing bookmark');}
        activeCell.model.metadata.delete('bookmarked');
        activeCell.node.classList.remove('bookmarked');
    }
}

/* -------------------------- Next/previous functionality -------------------- */

function jumpToNextBookmark(notebookTracker : INotebookTracker){
    if (VERBOSE > 0){console.log('Jump to next bookmark - pressed');}
    var notebook = notebookTracker.currentWidget!.content;
    const current_mode = notebook.mode;
    
    // Get current cell index
    const current_index = notebook.activeCellIndex;

    // Find next cell with bookmark
    for (const cell of notebook.widgets) {
        if (cell.model.metadata.get('bookmarked')) {
            // Get cell index
            const index = notebook.widgets.indexOf(cell);
            if (index > current_index) {
                // Jump to cell
                notebook.activeCellIndex = index;
                notebook.activeCell?.editor.focus();
                notebook.mode = current_mode;
                break;
            }
        }
    }
}

function jumpToPreviousBookmark(notebookTracker : INotebookTracker){
    if (VERBOSE > 0){console.log('Jump to previous bookmark - pressed');}
    var notebook = notebookTracker.currentWidget!.content;
    const current_mode = notebook.mode;
    
    // Get current cell index
    const current_index = notebook.activeCellIndex;

    // Find previous cell with bookmark

    for (const cell of notebook.widgets.slice().reverse()) {
        if (cell.model.metadata.get('bookmarked')) {
            // Get cell index
            const index = notebook.widgets.indexOf(cell);
            if (index < current_index) {
                // Jump to cell
                notebook.activeCellIndex = index;
                notebook.activeCell?.editor.focus();
                notebook.mode = current_mode;
                break;
            }
        }
    }
}

/* -------------------------------------------------------------------------- */
/*                                    Icons                                   */
/* -------------------------------------------------------------------------- */

const jumpIcon = new LabIcon({
    name: 'lsp:jump',
    svgstr: jumpSvg
    });


/* -------------------------------------------------------------------------- */
/*                               Register plugin                              */
/* -------------------------------------------------------------------------- */

const plugin: JupyterFrontEndPlugin<void> = {
  id: 'code-bookmarks',
  requires: [INotebookTracker],
  autoStart: true,
  activate: (
        app: JupyterFrontEnd, 
        notebookTracker: INotebookTracker,
    ) => {
    console.log('JupyterLab extension jupyterlab_code_bookmarks is activated!');
    
    /* -------------------------- Initialize extension -------------------------- */

    (async () => {
        await app.restored;

        // Function to add bookmark class

        async function add_bookmark_class(panel: NotebookPanel){
            // Wait until the notebook is fully rendered
            await panel.revealed;
            await panel.sessionContext.ready;
            
            // Add the classes
            if (VERBOSE > 0){console.log('Adding bookmark classes to ', panel.context.path);}
            var notebook = panel.content;
            for (const cell of notebook.widgets) {
                if (cell.model.metadata.get('bookmarked')) {
                    cell.node.classList.add('bookmarked');
                }
            }
        }

        // Loop over every notebook and add class

        notebookTracker.forEach((notebookPanel: NotebookPanel) => {
            add_bookmark_class(notebookPanel);
          });

        // Add an event listerer to add class whenever a notebook is opened

        notebookTracker.widgetAdded.connect(async (sender: INotebookTracker, notebookPanel: NotebookPanel) => {
            add_bookmark_class(notebookPanel);
          });

        /* ----------------------------- Define commands ---------------------------- */

        const toggleBookmarkCmd: string = 'code_bookmark:toggle';
        const nextBookmarkCmd: string = 'code_bookmark:next';
        const previousBookmarkCmd: string = 'code_bookmark:previous';

        /* -------------------------------------------------------------------------- */
        /*                     Add commands and front-end widgets                     */
        /* -------------------------------------------------------------------------- */

        /* ----------------------------- Create commands ---------------------------- */

        app.commands.addCommand(toggleBookmarkCmd, {
            execute: () => {
                toggleBookmark(notebookTracker);
            },
            label: 'Toggle bookmark'
        });

        app.commands.addCommand(nextBookmarkCmd, {
            execute: () => {
                jumpToNextBookmark(notebookTracker);
            },
            label: 'Jump to next bookmark'
        });

        app.commands.addCommand(previousBookmarkCmd, {
            execute: () => {
                jumpToPreviousBookmark(notebookTracker);
            },
            label: 'Jump to previous bookmark'
        });


        /* -------------------- Add toggle option to context menu ------------------- */

        app.contextMenu.addItem({
            type: 'separator',
            selector: '.jp-Notebook .jp-Cell',
            rank: 500
        });

        app.contextMenu.addItem({ 
            command: 'code_bookmark:toggle',
            selector: '.jp-Notebook .jp-Cell',
            rank:501
        })

        app.contextMenu.addItem({
            type: 'separator',
            selector: '.jp-Notebook .jp-Cell',
            rank: 503
        });

    })();

    /* ------------------------------ Jump buttons ------------------------------ */

    class ButtonExtensionNext
    implements DocumentRegistry.IWidgetExtension<NotebookPanel, INotebookModel>
    {
        createNew(
            panel: NotebookPanel,
        ): IDisposable {
            const action = () => {jumpToNextBookmark(notebookTracker)};

            const buttonNext = new ToolbarButton({
                className: 'bookmark-jump-button-next',
                label: 'Jump next',
                onClick: action,
                tooltip: 'Jump to next bookmark',
                icon : jumpIcon
            });

            panel.toolbar.insertItem(10, 'bookmarkJumpNextButton', buttonNext, );

            return new DisposableDelegate(() => {
                buttonNext.dispose();
            });
        }
    }

    class ButtonExtensionPrev
    implements DocumentRegistry.IWidgetExtension<NotebookPanel, INotebookModel>
    {
        createNew(
            panel: NotebookPanel,
        ): IDisposable {
            const action = () => {jumpToPreviousBookmark(notebookTracker)};

            const buttonPrev = new ToolbarButton({
                className: 'bookmark-jump-button-prev',
                label: 'Jump previous',
                onClick: action,
                tooltip: 'Jump to previous bookmark',
            });
        
            panel.toolbar.insertItem(10, 'bookmarkJumpPrevButton', buttonPrev);
        
            return new DisposableDelegate(() => {
            buttonPrev.dispose();
            });
        }
    }

    /* ------------------------- Add buttons to toolbar ------------------------- */

    app.docRegistry.addWidgetExtension('Notebook', new ButtonExtensionNext());
    app.docRegistry.addWidgetExtension('Notebook', new ButtonExtensionPrev());
  }
  
};

/* -------------------------------------------------------------------------- */
/*                        Export the plugin as default                        */
/* -------------------------------------------------------------------------- */

export default plugin;