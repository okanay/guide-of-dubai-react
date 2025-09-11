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

  public openModal(scopeId: string = 'body'): void {
    // Bu scope'taki modal sayısını artır
    const currentCount = this.modalStacks.get(scopeId) || 0
    this.modalStacks.set(scopeId, currentCount + 1)

    // Eğer bu scope'ta ilk modal açılıyorsa
    if (currentCount === 0) {
      this.lockScope(scopeId)
    }
  }

  public closeModal(scopeId: string = 'body'): void {
    const currentCount = this.modalStacks.get(scopeId) || 0

    if (currentCount <= 0) {
      console.warn(`No modals to close in scope: ${scopeId}`)
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
        this.originalScrollPositions.set('body', window.scrollY)
        document.body.style.position = 'fixed'
        document.body.style.top = `-${window.scrollY}px`
        document.body.style.left = '0'
        document.body.style.right = '0'
        document.body.style.overflow = 'hidden'
      }
    } else {
      this.bodyLockCount++
      if (this.bodyLockCount === 1) {
        this.originalScrollPositions.set('body', window.scrollY)
        document.body.style.position = 'fixed'
        document.body.style.top = `-${window.scrollY}px`
        document.body.style.left = '0'
        document.body.style.right = '0'
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
        const originalScrollY = this.originalScrollPositions.get('body') || 0
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.left = ''
        document.body.style.right = ''
        document.body.style.overflow = ''
        window.scrollTo(0, originalScrollY)
        this.originalScrollPositions.delete('body')
      }
    } else {
      // Diğer scope'lar için - ama body lock sayısını da azalt
      this.bodyLockCount--
      if (this.bodyLockCount === 0) {
        const originalScrollY = this.originalScrollPositions.get('body') || 0
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.left = ''
        document.body.style.right = ''
        document.body.style.overflow = ''
        window.scrollTo(0, originalScrollY)
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
    // Toplam modal sayısı
    return Array.from(this.modalStacks.values()).reduce((sum, count) => sum + count, 0)
  }

  public getAllScopes(): Record<string, number> {
    return Object.fromEntries(this.modalStacks)
  }

  // Emergency reset - development için
  public reset(): void {
    this.modalStacks.clear()
    this.originalScrollPositions.clear()
    this.bodyLockCount = 0

    // Body'yi temizle
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.left = ''
    document.body.style.right = ''
    document.body.style.overflow = ''

    // Tüm bilinen scope'ları temizle
    const allElements = document.querySelectorAll('[id]')
    allElements.forEach((element) => {
      if (element instanceof HTMLElement) {
        element.style.overflow = ''
      }
    })
  }
}

// Export singleton instance
export const modalManager = GlobalModalManager.getInstance()
