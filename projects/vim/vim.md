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

" automatically change directory to current file
set autochdir

" color scheme
colorscheme slate 
"	set background=dark
" ctermbg=0 (black) shows up as grey in my terminal
" this sets background to pure black
highlight Normal ctermbg=16

" show line numbers
set nu
" line number color
highlight LineNr ctermfg=grey

" completion - use with <C-X><C-O>
filetype plugin on
set omnifunc=syntaxcomplete#Complete
" this is for <C-N> or <C-P> completion
set completeopt=longest,menuone

" highlight function calls (currently in ~/.vim/syntax)
" syn match dFunction "\zs\(\k\w*\)*\s*\ze("
" hi link dFunction Function
```

## C/C++ syntax highlighting in `~/.vim/syntax/c.vim`

```vim

" Highlight Class and Function names
syn match    cCustomParen    "(" contains=cParen,cCppParen
syn match    cCustomFunc     "\w\+\s*(" contains=cCustomParen
syn match    cCustomScope    "::"
syn match    cCustomClass    "\w\+\s*::" contains=cCustomScope
syn match    cCustomDotAccess    "\v[a-zA-Z][_a-zA-Z0-9]{-}\ze\.\w"

" Operators
syntax match cOperator "\v\*"
syntax match cOperator "\v/"
syntax match cOperator "\v\+"
syntax match cOperator "\v-"
syntax match cOperator "\v\="
syntax match cOperator "\v\!"
syntax match cOperator "\v\*\="
syntax match cOperator "\v/\="
syntax match cOperator "\v\+\="
syntax match cOperator "\v-\="

highlight link cOperator Operator

hi def link cCustomFunc  Function
hi def link cCustomClass cStructure
hi def link cCustomDotAccess cStructure
```