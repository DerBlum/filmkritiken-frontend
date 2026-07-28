import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import { useArchivFilter } from '../useArchivFilter'
import type { Filmkritik } from '@/features/filmkritiken/types/filmkritik'

const dummyFilmkritiken: Filmkritik[] = [
  {
    id: '1',
    details: { beitragvon: 'Stefan', besprochenam: '2023-01-01T00:00:00Z', bewertungoffen: false },
    film: { titel: 'Matrix', erscheinungsjahr: 1999, regie: 'Wachowskis', laenge: 136 },
    bewertungen: [{ von: 'Stefan', wertung: 9, enthaltung: false }],
  },
  {
    id: '2',
    details: { beitragvon: 'Anna', besprochenam: '2024-05-10T00:00:00Z', bewertungoffen: false },
    film: { titel: 'Inception', erscheinungsjahr: 2010, regie: 'Christopher Nolan', laenge: 148 },
    bewertungen: [{ von: 'Anna', wertung: 10, enthaltung: false }],
  },
  {
    id: '3',
    details: { beitragvon: 'Stefan', besprochenam: '2022-12-15T00:00:00Z', bewertungoffen: false },
    film: { titel: 'Avatar', erscheinungsjahr: 2009, regie: 'James Cameron', laenge: 162 },
    bewertungen: [{ von: 'Stefan', wertung: 7, enthaltung: false }],
  },
]

describe('useArchivFilter', () => {
  it('filters by German title search', () => {
    const list = ref(dummyFilmkritiken)
    const { suche, filteredFilmkritiken } = useArchivFilter(list)

    suche.value = 'Matrix'
    expect(filteredFilmkritiken.value.length).toBe(1)
    expect(filteredFilmkritiken.value[0].film.titel).toBe('Matrix')
  })

  it('filters explicitly by original title search', () => {
    const list = ref(dummyFilmkritiken)
    list.value[0].film.originaltitel = 'The Matrix Reloaded Original'
    const { suche, filteredFilmkritiken } = useArchivFilter(list)

    suche.value = 'Reloaded Original'
    expect(filteredFilmkritiken.value.length).toBe(1)
    expect(filteredFilmkritiken.value[0].film.titel).toBe('Matrix')
  })

  it('filters by Besprechungsjahr', () => {
    const list = ref(dummyFilmkritiken)
    const { jahr, filteredFilmkritiken } = useArchivFilter(list)

    jahr.value = 2024
    expect(filteredFilmkritiken.value.length).toBe(1)
    expect(filteredFilmkritiken.value[0].film.titel).toBe('Inception')
  })

  it('filters by contributor (beitragvon)', () => {
    const list = ref(dummyFilmkritiken)
    const { beitragvon, filteredFilmkritiken } = useArchivFilter(list)

    beitragvon.value = 'Stefan'
    expect(filteredFilmkritiken.value.length).toBe(2)
  })

  it('sorts by beste rating', () => {
    const list = ref(dummyFilmkritiken)
    const { sortierung, filteredFilmkritiken } = useArchivFilter(list)

    sortierung.value = 'beste'
    expect(filteredFilmkritiken.value[0].film.titel).toBe('Inception') // 10
    expect(filteredFilmkritiken.value[1].film.titel).toBe('Matrix') // 9
    expect(filteredFilmkritiken.value[2].film.titel).toBe('Avatar') // 7
  })

  it('resets filters correctly', () => {
    const list = ref(dummyFilmkritiken)
    const filter = useArchivFilter(list)

    filter.suche.value = 'Matrix'
    filter.jahr.value = 1999
    expect(filter.isFilterActive.value).toBe(true)

    filter.resetFilters()
    expect(filter.suche.value).toBe('')
    expect(filter.jahr.value).toBeNull()
    expect(filter.isFilterActive.value).toBe(false)
  })

  it('computes verfuegbareJahre and verfuegbareBeitragende from list in client mode', () => {
    const list = ref(dummyFilmkritiken)
    const { verfuegbareJahre, verfuegbareBeitragende } = useArchivFilter(list)

    expect(verfuegbareJahre.value).toEqual([2024, 2023, 2022])
    expect(verfuegbareBeitragende.value).toEqual(['Anna', 'Stefan'])
  })
})
