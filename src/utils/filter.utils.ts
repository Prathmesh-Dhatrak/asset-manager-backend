import { Asset, AssetQueryParams } from '../types/asset.types';

/**
 * Filters and sorts assets based on query parameters
 * @param assets List of assets to filter and sort
 * @param queryParams Query parameters for filtering and sorting
 * @returns Filtered and sorted assets
 */
export const filterAssets = (
  assets: Asset[],
  queryParams: AssetQueryParams
): Asset[] => {
  let filteredAssets = [...assets];

  // Apply search filter
  if (queryParams.search) {
    const searchTerm = queryParams.search.toLowerCase();
    filteredAssets = filteredAssets.filter(
      (asset) =>
        asset.name.toLowerCase().includes(searchTerm) ||
        asset.description.toLowerCase().includes(searchTerm)
    );
  }

  // Apply type filter
  if (queryParams.type) {
    filteredAssets = filteredAssets.filter((asset) => asset.type === queryParams.type);
  }

  // Apply value range filters
  if (queryParams.minValue !== undefined) {
    filteredAssets = filteredAssets.filter((asset) => asset.value >= queryParams.minValue!);
  }

  if (queryParams.maxValue !== undefined) {
    filteredAssets = filteredAssets.filter((asset) => asset.value <= queryParams.maxValue!);
  }

  // Apply sorting
  if (queryParams.sortBy) {
    const sortOrder = queryParams.sortOrder === 'desc' ? -1 : 1;
    
    filteredAssets.sort((a, b) => {
      const valueA = a[queryParams.sortBy!];
      const valueB = b[queryParams.sortBy!];
      
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortOrder * valueA.localeCompare(valueB);
      }
      
      return sortOrder * (Number(valueA) - Number(valueB));
    });
  }

  return filteredAssets;
};