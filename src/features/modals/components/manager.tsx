class GlobalModalManager {
  private static instance: GlobalModalManager
  private modalStacks = new Map<string, number>()
  private originalScrollPositions = new Map<string, number>()
  private bodyLockCount = 0

  public static getInstance(): GlobalModalManager {
    if (!GlobalModalManager.instance) {
      GlobalModalManager.instance = new GlobalModalManager()
    }
    return GlobalModalManager.instance
  }

  private isIOSSafari(): boolean {
    if (typeof window === 'undefined') return false
    const userAgent = window.navigator.userAgent
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream
    const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent)
    return isIOS && isSafari
  }

  public openModal(scopeId: string = 'body'): void {
    const currentCount = this.modalStacks.get(scopeId) || 0
    this.modalStacks.set(scopeId, currentCount + 1)

    if (currentCount === 0) {
      this.lockScope(scopeId)
    }
  }

  public closeModal(scopeId: string = 'body'): void {
    const currentCount = this.modalStacks.get(scopeId) || 0

    if (currentCount <= 0) {
      return
    }

    const newCount = currentCount - 1
    this.modalStacks.set(scopeId, newCount)

    if (newCount === 0) {
      this.unlockScope(scopeId)
      this.modalStacks.delete(scopeId)
    }
  }

  private lockScope(scopeId: string): void {
    if (scopeId === 'body') {
      this.bodyLockCount++
      if (this.bodyLockCount === 1) {
        // iOS Safari için eski yaklaşım (liquid glass fix)
        if (this.isIOSSafari()) {
          this.originalScrollPositions.set('body', window.scrollY)
          document.body.style.position = 'fixed'
          document.body.style.top = `-${window.scrollY}px`
          document.body.style.left = '0'
          document.body.style.right = '0'
          document.body.style.width = '100%'
          document.body.style.overflow = 'hidden'
        } else {
          // Diğer tarayıcılar için container-based (body'ye dokunma)
          // Modal container'ın kendisi fixed olacak
        }
      }
    } else {
      // Diğer scope'lar için normal işlem
      this.bodyLockCount++
      if (this.bodyLockCount === 1 && this.isIOSSafari()) {
        this.originalScrollPositions.set('body', window.scrollY)
        document.body.style.position = 'fixed'
        document.body.style.top = `-${window.scrollY}px`
        document.body.style.left = '0'
        document.body.style.right = '0'
        document.body.style.width = '100%'
        document.body.style.overflow = 'hidden'
      }

      const element = document.getElementById(scopeId)
      if (element) {
        this.originalScrollPositions.set(scopeId, element.scrollTop)
        element.style.overflow = 'hidden'
      }
    }
  }

  private unlockScope(scopeId: string): void {
    if (scopeId === 'body') {
      this.bodyLockCount--
      if (this.bodyLockCount === 0) {
        // iOS Safari için eski yaklaşım (scroll restore)
        if (this.isIOSSafari()) {
          const originalScrollY = this.originalScrollPositions.get('body') || 0
          document.body.style.position = ''
          document.body.style.top = ''
          document.body.style.left = ''
          document.body.style.right = ''
          document.body.style.width = ''
          document.body.style.overflow = ''

          // Scroll pozisyonunu restore et
          requestAnimationFrame(() => {
            window.scrollTo({
              top: originalScrollY,
              behavior: 'instant',
            })
          })

          this.originalScrollPositions.delete('body')
        } else {
          // Diğer tarayıcılar için hiçbir şey yapma
        }
      }
    } else {
      this.bodyLockCount--
      if (this.bodyLockCount === 0 && this.isIOSSafari()) {
        const originalScrollY = this.originalScrollPositions.get('body') || 0
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.left = ''
        document.body.style.right = ''
        document.body.style.width = ''
        document.body.style.overflow = ''

        requestAnimationFrame(() => {
          window.scrollTo({
            top: originalScrollY,
            behavior: 'instant',
          })
        })

        this.originalScrollPositions.delete('body')
      }

      const element = document.getElementById(scopeId)
      if (element) {
        element.style.overflow = ''
        const originalScrollTop = this.originalScrollPositions.get(scopeId) || 0
        element.scrollTop = originalScrollTop
        this.originalScrollPositions.delete(scopeId)
      }
    }
  }

  public getOpenModalsCount(scopeId?: string): number {
    if (scopeId) {
      return this.modalStacks.get(scopeId) || 0
    }
    return Array.from(this.modalStacks.values()).reduce((sum, count) => sum + count, 0)
  }

  public getAllScopes(): Record<string, number> {
    return Object.fromEntries(this.modalStacks)
  }

  public reset(): void {
    this.modalStacks.clear()
    this.originalScrollPositions.clear()
    this.bodyLockCount = 0

    // Body stillerini temizle
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.left = ''
    document.body.style.right = ''
    document.body.style.width = ''
    document.body.style.overflow = ''

    // Diğer elementleri temizle
    const allElements = document.querySelectorAll('[id]')
    allElements.forEach((element) => {
      if (element instanceof HTMLElement) {
        element.style.overflow = ''
      }
    })
  }
}

export const modalManager = GlobalModalManager.getInstance()
