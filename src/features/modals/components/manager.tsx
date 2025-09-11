// src/utils/modal-manager.ts
class GlobalModalManager {
  private static instance: GlobalModalManager
  private openModalsCount = 0
  private originalScrollY = 0

  public static getInstance(): GlobalModalManager {
    if (!GlobalModalManager.instance) {
      GlobalModalManager.instance = new GlobalModalManager()
    }
    return GlobalModalManager.instance
  }

  public openModal(): void {
    if (this.openModalsCount === 0) {
      // İlk modal açılıyor - body'yi sabitle
      this.originalScrollY = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${this.originalScrollY}px`
      document.body.style.left = '0'
      document.body.style.right = '0'
      document.body.style.overflow = 'hidden'
    }
    this.openModalsCount++
    console.log(`Modal opened. Count: ${this.openModalsCount}`)
  }

  public closeModal(): void {
    this.openModalsCount--
    console.log(`Modal closed. Count: ${this.openModalsCount}`)

    if (this.openModalsCount === 0) {
      // Son modal kapanıyor - body'yi restore et
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.left = ''
      document.body.style.right = ''
      document.body.style.overflow = ''
      window.scrollTo(0, this.originalScrollY)
    }

    // Negatif sayıya düşmesin
    if (this.openModalsCount < 0) {
      this.openModalsCount = 0
    }
  }

  public getOpenModalsCount(): number {
    return this.openModalsCount
  }

  // Emergency reset - development için
  public reset(): void {
    this.openModalsCount = 0
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.left = ''
    document.body.style.right = ''
    document.body.style.overflow = ''
  }
}

// Export singleton instance
export const modalManager = GlobalModalManager.getInstance()
