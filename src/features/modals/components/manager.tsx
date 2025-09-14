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
      // BODY'Yİ RAHAT BIRAK! Sadece sayaç tut
      this.bodyLockCount++
      // Modal container'ın kendisi CSS ile fixed olacak
    } else {
      // Diğer scope'lar için normal işlem
      this.bodyLockCount++

      const element = document.getElementById(scopeId)
      if (element) {
        this.originalScrollPositions.set(scopeId, element.scrollTop)
        element.style.overflow = 'hidden'
      }
    }
  }

  private unlockScope(scopeId: string): void {
    if (scopeId === 'body') {
      // BODY'Yİ RAHAT BIRAK! Sadece sayaç azalt
      this.bodyLockCount--
      // Modal kapatıldığında body'de değişiklik yok = scroll pozisyonu korunuyor
    } else {
      // Diğer scope'ları restore et
      this.bodyLockCount--

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

    // Body'yi zaten değiştirmiyoruz, sadece diğer elementleri temizle
    const allElements = document.querySelectorAll('[id]')
    allElements.forEach((element) => {
      if (element instanceof HTMLElement) {
        element.style.overflow = ''
      }
    })
  }
}

export const modalManager = GlobalModalManager.getInstance()
