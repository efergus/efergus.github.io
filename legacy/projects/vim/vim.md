# VIM

I try to keep thinbgs pretty simple with what I change in vim, and avoid plugins for simplicity

## My .vimrc

```vim
" turn on mouse
set mouse=a
" tab spacing
set tabstop=4
set shiftwidth=4
set autoindent

"remap leader key to space for convenience
let mapleader = "\<Space>"

" some completion configurations
set wildmenu
set wildmode=longest:full,full

" set compund line numbering
set number relativenumber

" Faster motions with <Shift>
noremap H 5h
noremap L 5l
noremap J 3j
noremap K 3k
noremap W 3w
noremap B 3b

" C-s to save
nnoremap <C-s> :w<CR>
nnoremap <Leader><C-s> :write
inoremap <C-s> <C-o>:w<CR>

" remap ; to : and : to ;
"	not sure if I like it yet
noremap ; :
noremap : ;

"remap U to redo
nnoremap U <C-r>

" <Space>y to copy to clipboard, <Space>p to paste from clipboard, <Space>d to cut to clipboard
noremap <Leader>y "+y
noremap <Leader>d "+d
noremap <Leader>p "+p
" <Space>Y to copy to end of line to clipboard (Y yank to end of line)
noremap <Leader>Y "+y$
noremap Y y$
" <Space>D to cut to end of line to clipboard
noremap <Leader>D "+D
" <Space>P to paste before cursor from clipboard
noremap <Leader>P "+P

" Backspace works in normal and visual mode
nnoremap <BS> "_d<Left>
vnoremap <BS> "_d
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
