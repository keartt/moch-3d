import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' → dist 폴더를 어떤 정적 호스팅(서브경로 포함)에 올려도 동작
export default defineConfig({ plugins: [react()], base: './' })
