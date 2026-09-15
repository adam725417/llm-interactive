function applyEssentialsCopy() {
  const brandName = document.querySelector('.brand b')
  const brandTagline = document.querySelector('.brand small')
  const heroTitle = document.querySelector('.hero-copy h1')
  const footer = document.querySelector('.footer-note')

  if (brandName) brandName.textContent = 'AI Lab'
  if (brandTagline) brandTagline.textContent = '用白話幫你整理AI觀念'
  if (heroTitle) heroTitle.innerHTML = '2026 年不可不知的<br><em>AI觀念</em>'
  if (footer) footer.textContent = 'AI Lab · 七號演算整合股份有限公司'

  document.title = 'AI Lab 教學站'
}

function scheduleApply() {
  requestAnimationFrame(applyEssentialsCopy)
}

document.addEventListener('DOMContentLoaded', scheduleApply)
window.addEventListener('load', scheduleApply)
window.addEventListener('hashchange', scheduleApply)
