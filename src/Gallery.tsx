import { RouteComponentProps } from '@reach/router';
import { AxiosResponse } from 'axios';
import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { IDropdown, IIndexStringArr } from './models/common.model';
import { Dialog } from 'primereact/dialog';
import { Galleria } from 'primereact/galleria';
import AssetsService from './services/assets.service';
import './Gallery.scss';
import { Dropdown } from 'primereact/dropdown';
import { NotificationContext } from './context/NotificationContext';

interface IProps extends RouteComponentProps {}

const GalleryComponent: FunctionComponent<IProps> = () => {
  // eslint-disable-next-line
  const [notify, setNotify] = useContext(NotificationContext);
  const [list, setList] = useState<IIndexStringArr>();
  const [ddList, setDDList] = useState<IDropdown[]>([]);
  const [category, setCategory] = useState<string>('all');
  const [openDialog, setOpenDialog] = useState<string | null>(null);
  const [dialogHeader, setDialogHeader] = useState('');
  const responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 5,
      numScroll: 5
    },
    {
      breakpoint: '600px',
      numVisible: 3,
      numScroll: 3
    },
    {
      breakpoint: '480px',
      numVisible: 3,
      numScroll: 3
    }
  ];

  const openImage = (e: any) => {
    const path = e.target.src;
    const fileName = path.split('galleryPics/');
    setDialogHeader(getImageDate(fileName[1]));
    setOpenDialog(path);
  };

  const getImageDate = (image: string) => {
    if (image?.length) {
      const imageDate = image.split('_')[0];
      const dateSplit = imageDate.split('-');
      return `${dateSplit[1]}/${dateSplit[2]}/${dateSplit[0]}`;
    }
    return '';
  };

  const itemTemplate = (item: string) => {
    return (
      <img
        className="item-template"
        src={`galleryPics/${item}`}
        alt="pic of collection"
        onClick={openImage}
      />
    );
  };

  const thumbnailTemplate = (item: string) => {
    return <img src={`galleryPics/${item}`} alt="thumb of collection" className="thumb-template" />;
  };

  const getCaption = (e: string) => {
    return getImageDate(e);
  };

  useEffect(() => {
    AssetsService.getGalleryList()
      .then((list: AxiosResponse) => {
        setList(list.data);
        setDDList(Object.keys(list.data).map((d: any) => ({ label: d, value: d })));
      })
      .catch((error) => {
        setNotify({
          severity: 'error',
          detail: error,
          summary: 'ERROR'
        });
        console.log('gallery list error', error);
      });
  }, [setNotify]);
  return (
    <div className="gallery-wrapper">
      {list && (
        <>
          <div className="dropdown-wrapper">
            <label htmlFor="category" className="dropdown-label">
              Select category:
            </label>
            <Dropdown
              className="dropdown"
              id="category"
              name="category"
              value={category}
              onChange={(e) => {
                setCategory(e.value);
              }}
              options={ddList || []}
            />
          </div>
          {category && (
            <Galleria
              value={list[category] as string[]}
              item={itemTemplate}
              thumbnail={thumbnailTemplate}
              responsiveOptions={responsiveOptions}
              numVisible={4}
              className="gallery"
              caption={getCaption}
            />
          )}
          <Dialog
            header={dialogHeader}
            visible={!!openDialog}
            onHide={() => setOpenDialog(null)}
            position="top"
            style={{ height: '92vh', width: 'auto', maxWidth: '100%' }}
          >
            <div className="dialog-image">
              <img src={openDialog as string} alt="" className="dialog-image--image" />
            </div>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default GalleryComponent;
