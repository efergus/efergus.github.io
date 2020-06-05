# VIM

I try to keep thinbgs pretty simple with what I change in vim, and avoid plugins for simplicity

## My .vimrc

```vim
" turn on syntax highlighting
syntax on

" turn on mouse
set mouse=a
" tab spacing
set tabstop=4
set shiftwidth=4
set autoindent

" change directory to current file
set autochdir
"show some commands vim usually doesn't show
set showcmd
"remap leader key to space for convenience
let mapleader = "\<Space>"

colorscheme slate 
" ctermbg=0 (black) shows up as grey in my terminal
" this sets background to pure black
highlight Normal ctermbg=16
" line numbering
set nu
highlight LineNr ctermfg=grey

" completion - use with <C-X><C-O>
filetype plugin on
set omnifunc=syntaxcomplete#Complete
set completeopt=longest,menuone
" command completion
set wildmenu
set wildmode=longest:full,full

"remap tab to <:> in normal mode
nnoremap <Tab> :
"remap H and L for tab switching
nnoremap H gT
nnoremap L gt
" gT - tab left
" gt - tab right
" :tabe <file> opens a new tab, :tabc closes a tab
"remap U to redo
nnoremap U <C-r>
"map space,y to copy to clipboard
noremap <Leader>y "+y
noremap <Leader>p "+p
```

## C/C++ syntax highlighting in *`~/.vim/syntax/c.vim`*

```vim

" Highlight Class and Function names
syn match    cCustomParen    "(" contains=cParen,cCppParen
syn match    cCustomFunc     "\w\+\s*(" contains=cCustomParen
syn match    cCustomScope    "::"
syn match    cCustomClass    "\w\+\s*::" contains=cCustomScope
syn match    cCustomDotAccess    "\v[a-zA-Z][_a-zA-Z0-9]{-}\ze\.\w"

" Operators
syn match cOperator "\v/"
syn match cOperator "\v\+"
syn match cOperator "\v-"
syn match cOperator "\v\="
syn match cOperator "\v\*"
syn match cOperator "\v\!"
syn match cOperator "\v\*\="
syn match cOperator "\v/\="
syn match cOperator "\v\+\="
syn match cOperator "\v-\="

highlight link cOperator Operator

hi def link cCustomFunc  Function
hi def link cCustomClass cStructure
hi def link cCustomDotAccess cStructure
```