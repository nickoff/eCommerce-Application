import { FacetResults, TermFacetResult } from '@commercetools/platform-sdk';

export function getFacetTerms(facets: FacetResults, field: string): string[] | null {
  const facetTerms = facets[field];

  if (!facetTerms) {
    return null;
  }

  return (facetTerms as TermFacetResult)?.terms.map((t) => t.term as string);
}
