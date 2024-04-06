@echo off
goto comment
set /A "index = 1"
set /A "count = 5"
:while
if %index% leq %index% (
   echo The value of index is %index%
   set /A "index = index + 1"
   goto :while
)
:comment

sass ./FrontEndDev/allstyles/styles.scss ./wwwroot/css/allstyles/styles.css