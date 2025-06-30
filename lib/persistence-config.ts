// Configuração de persistência para garantir que todos os dados sejam mantidos
export const PERSISTENCE_CONFIG = {
  // Configurações de cache
  CACHE_DURATION: 24 * 60 * 60 * 1000, // 24 horas
  SYNC_INTERVAL: 5 * 60 * 1000, // 5 minutos
  
  // Configurações de localStorage
  STORAGE_KEYS: {
    PRODUCTS: 'printsbrindes-products',
    CATALOG: 'printsbrindes-catalog',
    SETTINGS: 'printsbrindes-settings',
    CART: 'printsbrindes-cart',
    AUTH: 'printsbrindes-auth',
    ANALYTICS: 'printsbrindes-analytics',
    SEO_SETTINGS: 'printsbrindes-seo'
  },
  
  // Configurações de backup
  BACKUP_ENABLED: true,
  BACKUP_INTERVAL: 60 * 60 * 1000, // 1 hora
  MAX_BACKUPS: 5,
  
  // Configurações de sincronização
  SYNC_ENABLED: true,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 2000, // 2 segundos
  
  // Configurações de SEO
  SEO_DEFAULTS: {
    siteTitle: "PrintsBrindes - Presentes e Artigos Personalizados",
    siteDescription: "Presentes e artigos para festas personalizados! Canecas, cadernos, bolos e muito mais, tudo personalizado do seu jeito!",
    keywords: "presentes personalizados, brindes, festas, canecas, cadernos, bolos, personalização, Guaratiba, Rio de Janeiro",
    customDomain: "printsbrindes.com.br"
  }
}

// Função para verificar se o localStorage está disponível
export function isLocalStorageAvailable(): boolean {
  try {
    if (typeof window === 'undefined') return false
    const test = '__localStorage_test__'
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch {
    return false
  }
}

// Função para salvar dados com fallback
export function saveToStorage(key: string, data: any): boolean {
  try {
    if (!isLocalStorageAvailable()) return false
    localStorage.setItem(key, JSON.stringify({
      data,
      timestamp: Date.now(),
      version: '1.0'
    }))
    return true
  } catch (error) {
    console.warn('Erro ao salvar no localStorage:', error)
    return false
  }
}

// Função para carregar dados com fallback
export function loadFromStorage(key: string): any {
  try {
    if (!isLocalStorageAvailable()) return null
    const stored = localStorage.getItem(key)
    if (!stored) return null
    
    const parsed = JSON.parse(stored)
    
    // Verificar se os dados não estão muito antigos
    if (Date.now() - parsed.timestamp > PERSISTENCE_CONFIG.CACHE_DURATION) {
      localStorage.removeItem(key)
      return null
    }
    
    return parsed.data
  } catch (error) {
    console.warn('Erro ao carregar do localStorage:', error)
    return null
  }
}

// Função para limpar dados antigos
export function cleanupStorage(): void {
  try {
    if (!isLocalStorageAvailable()) return
    
    Object.values(PERSISTENCE_CONFIG.STORAGE_KEYS).forEach(key => {
      const stored = localStorage.getItem(key)
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          if (Date.now() - parsed.timestamp > PERSISTENCE_CONFIG.CACHE_DURATION) {
            localStorage.removeItem(key)
          }
        } catch {
          localStorage.removeItem(key)
        }
      }
    })
  } catch (error) {
    console.warn('Erro na limpeza do localStorage:', error)
  }
}

// Função para criar backup dos dados
export function createBackup(): boolean {
  try {
    if (!isLocalStorageAvailable()) return false
    
    const backup = {
      timestamp: Date.now(),
      data: {}
    }
    
    // Coletar todos os dados importantes
    Object.entries(PERSISTENCE_CONFIG.STORAGE_KEYS).forEach(([name, key]) => {
      const data = loadFromStorage(key)
      if (data) {
        // @ts-ignore
        backup.data[name] = data
      }
    })
    
    // Salvar backup
    const backupKey = `printsbrindes-backup-${Date.now()}`
    localStorage.setItem(backupKey, JSON.stringify(backup))
    
    // Limitar número de backups
    const allKeys = Object.keys(localStorage).filter(key => key.startsWith('printsbrindes-backup-'))
    if (allKeys.length > PERSISTENCE_CONFIG.MAX_BACKUPS) {
      allKeys.sort().slice(0, -PERSISTENCE_CONFIG.MAX_BACKUPS).forEach(key => {
        localStorage.removeItem(key)
      })
    }
    
    return true
  } catch (error) {
    console.warn('Erro ao criar backup:', error)
    return false
  }
}

// Função para restaurar backup
export function restoreBackup(timestamp?: number): boolean {
  try {
    if (!isLocalStorageAvailable()) return false
    
    let backupKey: string
    
    if (timestamp) {
      backupKey = `printsbrindes-backup-${timestamp}`
    } else {
      // Pegar o backup mais recente
      const allBackups = Object.keys(localStorage)
        .filter(key => key.startsWith('printsbrindes-backup-'))
        .sort()
        .reverse()
      
      if (allBackups.length === 0) return false
      backupKey = allBackups[0]
    }
    
    const backup = localStorage.getItem(backupKey)
    if (!backup) return false
    
    const parsed = JSON.parse(backup)
    
    // Restaurar dados
    Object.entries(parsed.data).forEach(([name, data]) => {
      const key = PERSISTENCE_CONFIG.STORAGE_KEYS[name as keyof typeof PERSISTENCE_CONFIG.STORAGE_KEYS]
      if (key) {
        saveToStorage(key, data)
      }
    })
    
    return true
  } catch (error) {
    console.warn('Erro ao restaurar backup:', error)
    return false
  }
}

// Inicializar sistema de persistência
export function initializePersistence(): void {
  if (typeof window === 'undefined') return
  
  // Limpeza inicial
  cleanupStorage()
  
  // Configurar backup automático se habilitado
  if (PERSISTENCE_CONFIG.BACKUP_ENABLED) {
    setInterval(() => {
      createBackup()
    }, PERSISTENCE_CONFIG.BACKUP_INTERVAL)
  }
  
  // Configurar limpeza periódica
  setInterval(() => {
    cleanupStorage()
  }, PERSISTENCE_CONFIG.CACHE_DURATION)
  
  console.log('Sistema de persistência inicializado')
}