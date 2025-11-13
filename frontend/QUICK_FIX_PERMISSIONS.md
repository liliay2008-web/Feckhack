# Быстрое решение "Permission denied"

## Windows

1. **Откройте PowerShell от имени администратора**
2. Перейдите в директорию проекта:
   ```powershell
   cd F:\hack_second\frontend
   ```
3. Очистите и переустановите:
   ```powershell
   Remove-Item -Recurse -Force node_modules
   Remove-Item -Force package-lock.json
   npm cache clean --force
   npm install
   ```
4. Запустите:
   ```powershell
   npm run dev
   ```

## Если порт занят

Используйте другой порт:
```powershell
npm run dev:3001
# или
npm run dev:3002
```

## Linux/Mac

```bash
cd frontend
sudo chown -R $USER:$USER .
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
npm run dev
```

