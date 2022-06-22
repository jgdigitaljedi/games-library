export default function (view: string) {
  switch (view) {
    case 'games':
      return [
        { label: 'Name', value: 'name' },
        { label: 'Console', value: 'consoleName' },
        { label: '# Players', value: 'multilayerNumber' },
        { value: 'genres', label: 'Genres' },
        { value: 'howAcquired', label: 'How Acquired' },
        { value: 'esrb', label: 'ESRB Rating' }
      ];
    case 'consoles':
      return [
        { value: 'name', label: 'Name' },
        { value: 'gb.company', label: 'Company' },
        { value: 'generation', label: 'Gen' },
        { value: 'condition', label: 'Condition' },
        { value: 'howAcquired', label: 'How Acquired' }
      ];
    case 'accessories':
      return [
        { value: 'name', label: 'Name' },
        { value: 'company', label: 'Company' },
        { value: 'forConsoleName', label: 'Console' },
        { value: 'type', label: 'Type' },
        { value: 'quantity', label: 'quantity' },
        { value: 'howAcquired', label: 'How Acquired' }
      ];
    case 'clones':
      return [
        { value: 'name', label: 'Name' },
        { value: 'company', label: 'Company' }
      ];
    case 'collectibles':
      return [
        { value: 'Name', label: 'Name' },
        { value: 'company', label: 'Company' },
        { value: 'type', label: 'Type' },
        { value: 'quantity', label: 'Quantity' },
        { value: 'officialLicensed', label: 'Official' },
        { value: 'howAcquired', label: 'How Acquired' }
      ];
    case 'hardware':
      return [
        { value: 'name', label: 'Name' },
        { value: 'type', label: 'Type' },
        { value: 'company', label: 'Company' },
        { value: 'quantity', label: 'Quantity' },
        { value: 'howAcquired', label: 'How Acquired' }
      ];
  }
}
