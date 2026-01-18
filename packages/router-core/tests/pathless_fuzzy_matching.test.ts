
import { describe, expect, it } from 'vitest'
import {
  findRouteMatch,
  processRouteTree,
} from '../src/new-process-route-tree'

describe('repro issue', () => {
  it('fuzzy match should find pathless layout route when children do not match', () => {
      const tree = {
        id: '__root__',
        isRoot: true,
        fullPath: '/',
        path: '/',
        children: [
            {
                id: '/_layout',
                fullPath: '/', 
                path: '', 
                children: [
                    {
                        id: '/_layout/child',
                         fullPath: '/child',
                         path: 'child'
                    }
                ]
            }
        ]
      }
      
      const { processedTree } = processRouteTree(tree as any)
      
      // Test 1: Exact match child
      expect(findRouteMatch('/child', processedTree)?.route.id).toBe('/_layout/child')
      
      // Test 2: Fuzzy match on missing path that should be caught by _layout
      // Since _layout is deeper than Root, it should be the preferred fuzzy match.
      const match = findRouteMatch('/missing', processedTree, true)
      expect(match?.route.id).toBe('/_layout')
  })
})
