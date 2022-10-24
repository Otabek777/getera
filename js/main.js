// function ScrollProgressHandler(waypoints, offset) {
//   this.waypoints = waypoints;
//   this.offset = offset;
//   this.currentWaypoint = -1;
//
//   this.handle = function() {
//     let wp = -1;
//     for (let i = 0; i < this.waypoints.length; i++) {
//       let offset = typeof(this.offset) == 'function' ? this.offset() : this.offset;
//       if (scrollPos + offset > this.waypoints[i][0])
//         wp = i;
//       else
//         break;
//     }
//
//     if (wp === -1) {
//       this.currentWaypoint = -1;
//     } else if (wp !== this.currentWaypoint) {
//       this.currentWaypoint = wp;
//       this.waypoints[wp][1]();
//     }
//   };
//
//   this.handle();
//
//   let classInstance = this;
//   $(window).scroll(function() {
//     classInstance.handle();
//   });
// }
//
// function setScrollStatus(x) {
//   //console.log('setScrollStatus', x)
//   const socLinksEl = $('.fullscreen-fixed .soc-links')
//   const scrollProgressEl = $('.scroll-progress')
//
//   if (x === 1) {
//     socLinksEl.addClass('opacity-0')
//     scrollProgressEl.addClass('opacity-0-mobile')
//   } else {
//     socLinksEl.removeClass('opacity-0')
//     scrollProgressEl.removeClass('opacity-0-mobile')
//   }
//
//   const allPoints = $('.scroll-progress .point')
//   allPoints.each((i, el) => {
//     el.classList.remove('active')
//   })
//
//   allPoints[x - 1].classList.add('active')
// }
//
// $(document).ready(() => {
//   function resetScrollProgress() {
//     setScrollStatus(1)
//     $('.scroll-progress .arrow-up').addClass('opacity-0')
//   }
//
//   resetScrollProgress()
//
//   new ScrollProgressHandler(
//     [
//       [0, () => { resetScrollProgress() }],
//       [928, () => { setScrollStatus(2); $('.scroll-progress .arrow-up').removeClass('opacity-0')}],
//     ], 0);
// });
//
// let scrollPos = $(window).scrollTop();
// let oldScrollPos = scrollPos;
//
// $(window).scroll(function () {
//   scrollPos = $(window).scrollTop();
//
//   oldScrollPos = scrollPos;
// });



let loadingProgress = 0;

function updateLoadingProgress() {
  loadingProgress += 0.5;
  if (loadingProgress === 1) {
    setTimeout(() => {
      $('.head-text').addClass('show')
      $('.welcome-section').addClass('bright')
      $('.welcome-section .gradient').addClass('opacity-0')
    }, 600)
  }
}

$('<img>').attr('src', '/img/welcome-section-bg.jpg').on('load', function() {
  $(this).remove();
  updateLoadingProgress()
});


$('<img>').attr('src', '/img/welcome-section-bg-mobile.jpg').on('load', function() {
  $(this).remove();
  updateLoadingProgress()
});


function slowScrollTo(pos) {
  $('html, body').stop(true, false).animate({
    scrollTop: pos}, 1000
  );
}

// window.addEventListener('mousewheel',e => {
//   if (e.deltaY > 0) {
//     $('.welcome-section').removeClass('scrolled')
//     $('.services-section').addClass('scrolled')
//     setScrollStatus(2)
//   } else {
//     $('.welcome-section').addClass('scrolled')
//     $('.services-section').removeClass('scrolled')
//     setScrollStatus(1)
//   }
// })



//======================================================================================================================

// let els = document.getElementsByClassName('animated-service-description');
// let newDom = '';
// let animationDelay = 6;
//
// for (const el of els) {
//   for (let i = 0; i < el.innerText.length; i++) {
//     newDom += '<span class="char">' + (el.innerText[i] == ' ' ? '&nbsp;' : el.innerText[i]) + '</span>';
//   }
//
//   el.innerHTML = newDom;
//   let length = el.children.length;
//
//   for (let i = 0; i < length; i++) {
//     el.children[i].style['animation-delay'] = animationDelay * i + 'ms';
//   }
// }


class CoolSectionScroll {
  sections
  blocks
  currentSectionID
  lastScrollEventAt

  updateElementClassList(el, add, remove) {
    el.classList.add(...add)
    el.classList.remove(...remove)
  }

  constructor() {
    this.sections = []
    this.blocks = []
    this.currentSectionID = 0
    this.lastScrollEventAt = Date.now()

    window.addEventListener('wheel', e => {
      const now = Date.now()

      if (now - this.lastScrollEventAt < 550)
        return
      else
        this.lastScrollEventAt = now

      if (window.innerWidth > 600) {
        this.scroll(e.deltaY, false)
      }
    })

    let i = 0

    while (true) {
      const section = document.getElementsByClassName(`section-${i}`)[0]

      if (section) {
        this.sections.push(section)

        const elements = section.querySelectorAll('.css-block')

        this.blocks[i] = {
          elements,
          currentBlockID: 0
        }


        if (elements[0])
          elements[0].classList.add('css-block--current')

        for (let j = 1; j < elements.length; j++) {
          elements[j].classList.add('css-block--next')
        }

      } else {
        break
      }

      i++
    }

    this.sections[0].classList.add('css-section--current')
    this.sections[0].style.opacity = 1;

    for (let i = 1; i < this.sections.length; i++) {
      this.sections[i].classList.add('css-section--next')

      setTimeout(() => {
        this.sections[i].style.opacity = 1;
      }, 1000)
    }
  }

  scroll(deltaY, force) {
    let sectionBlocksData = this.blocks[this.currentSectionID]

    const goToNextSection = () => {
      this.updateElementClassList(this.sections[this.currentSectionID], ['css-section--prev'], ['css-section--current'])
      this.currentSectionID++
      this.updateElementClassList(this.sections[this.currentSectionID], ['css-section--current'], ['css-section--next'])
    }

    const goToPrevSection = () => {
      this.updateElementClassList(this.sections[this.currentSectionID], ['css-section--next'], ['css-section--current'])
      this.currentSectionID--
      this.updateElementClassList(this.sections[this.currentSectionID], ['css-section--current'], ['css-section--prev'])
    }



    if (deltaY > 0) {
      if (sectionBlocksData.elements && sectionBlocksData.currentBlockID < sectionBlocksData.elements.length - 1) {
        if (force) {
          for (let i = 0; i < sectionBlocksData.elements.length - 1; i++) {
            this.updateElementClassList(sectionBlocksData.elements[i], ['css-block--prev', 'css-block--hidden'], ['css-block--current', 'css-block--next'])
          }

          const id = sectionBlocksData.elements.length - 1

          this.updateElementClassList(sectionBlocksData.elements[id], ['css-block--current'], ['css-block--hidden', 'css-block--next'])
          sectionBlocksData.currentBlockID = id
          goToNextSection()
        } else {
          this.updateElementClassList(sectionBlocksData.elements[sectionBlocksData.currentBlockID], ['css-block--prev'], ['css-block--current'])

          setTimeout(() => {
            this.updateElementClassList(sectionBlocksData.elements[sectionBlocksData.currentBlockID], ['css-block--hidden'], [])

            sectionBlocksData.currentBlockID++
            sectionBlocksData = this.blocks[this.currentSectionID]


            this.updateElementClassList(sectionBlocksData.elements[sectionBlocksData.currentBlockID], ['css-block--current'], ['css-block--hidden', 'css-block--next'])

          }, 500)
        }


      } else if (this.currentSectionID < this.sections.length - 1) {
        goToNextSection()
      }
    } else if (deltaY < 0) {
      if (sectionBlocksData.elements && sectionBlocksData.currentBlockID > 0) {
        if (force) {
          for (let i = sectionBlocksData.elements.length - 1; i > 0; i--) {
            this.updateElementClassList(sectionBlocksData.elements[i], ['css-block--next', 'css-block--hidden'], ['css-block--current', 'css-block--prev'])
          }

          const id = 0
          this.updateElementClassList(sectionBlocksData.elements[id], ['css-block--current'], ['css-block--hidden', 'css-block--prev'])

          sectionBlocksData.currentBlockID = id
          goToPrevSection()
        } else {
          this.updateElementClassList(sectionBlocksData.elements[sectionBlocksData.currentBlockID], ['css-block--next'], ['css-block--current'])

          setTimeout(() => {

            this.updateElementClassList(sectionBlocksData.elements[sectionBlocksData.currentBlockID], ['css-block--hidden'], [])

            sectionBlocksData.currentBlockID--
            sectionBlocksData = this.blocks[this.currentSectionID]

            this.updateElementClassList(sectionBlocksData.elements[sectionBlocksData.currentBlockID], ['css-block--current'], ['css-block--hidden', 'css-block--prev'])

          }, 500)
        }
      } else if (this.currentSectionID > 0) {
        goToPrevSection()
      }
    }

    $('.scroll-progress .point').removeClass('active')
    $('.scroll-progress .point')[this.currentSectionID].classList.add('active')

    if (this.currentSectionID == 0)
      $('.scroll-progress .arrow-up').addClass('opacity-0')
    else
      $('.scroll-progress .arrow-up').removeClass('opacity-0')

    if (this.currentSectionID == 3)
      $('.scroll-progress .arrow-down').addClass('opacity-0')
    else
      $('.scroll-progress .arrow-down').removeClass('opacity-0')
  }
}

const css = new CoolSectionScroll()

$('.nav a').click(function() {
  if (window.innerWidth < 700)
    document.body.classList.remove('nav-active')

  const toSection = $(this).data('to-section')

  scrollToSection(toSection)
})

function scrollToSection(section) {
  const delta = section - css.currentSectionID
  const times = Math.abs(delta)

  for (let i = 0; i < times; i++) {
    css.scroll(delta, true)
  }

  const links = $('.nav a')
  links.removeClass('active')

  $(links[section]).addClass('active')
}

//scrollToSection(4)