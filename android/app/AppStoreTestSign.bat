@echo off
cd /d %~dp0

setlocal enabledelayedexpansion

set file_path=%1
set hash_algorithm=SHA256

rem 获取 APK 文件的 SHA256 散列值（数据有空格，下面会去掉）
set num=0
for /f "usebackq tokens=*" %%A in (`certutil -hashfile %file_path% %hash_algorithm%`) do (
  set command_output[!num!]=%%A
  set /a num=num+1
)

rem 2024年1月25日 output_hash 得到的数据格式应为：fb9e0500ec861099a7e72765bf14ec066c62f4f4392c267c79ace31a9c70ea97（不能有空格或英文冒号，否则安装失败）

rem 下面这行用于获取去掉空格后的数据。
set output_hash=%command_output[1]: =%
set OUTPUT_FILE=%file_path%.sha256
set SIGNATURE_FILE=%file_path%.sig
echo | set /p dummyName="%output_hash%" > %OUTPUT_FILE%

rem 2024年1月25日 openssl 版本：1.1.1w，超过 3.0.0 版本有错误提示
openssl rsautl -sign -inkey app_private_key_10_test.pem -in %OUTPUT_FILE% -out %SIGNATURE_FILE%

copy %file_path% %file_path%.bak
copy /b %file_path% + %SIGNATURE_FILE% %file_path%

del %OUTPUT_FILE%
del %SIGNATURE_FILE%

echo %DATE% %TIME% : %~n0 successfully finished.
echo %file_path% %hash_algorithm% = %output_hash%
rem 注意：安装 APK 时，必须使用 adb install -r xxx.apk 命令行安装，直接复制 APK 文件到设备将无法安装

endlocal