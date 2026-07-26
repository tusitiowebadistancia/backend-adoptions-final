$ErrorActionPreference = "Stop"

Write-Host "1/4 Instalando dependencias..."
npm install

Write-Host "2/4 Ejecutando tests..."
npm test

Write-Host "3/4 Ejecutando cobertura..."
npm run test:coverage

Write-Host "4/4 Verificación terminada correctamente."
