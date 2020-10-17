import { RouteComponentProps } from '@reach/router';
import { AxiosResponse } from 'axios';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { IIndexStringArr } from './models/common.model';
import { Card } from 'primereact/card';
import { Dialog } from 'primereact/dialog';
import { Galleria } from 'primereact/galleria';
import AssetsService from './services/assets.service';
import './Gallery.scss';


interface IProps extends RouteComponentProps {}

const GalleryComponent: FunctionComponent<IProps> = () => {
  const [list, setList] = useState<IIndexStringArr>();
  const [openDialog, setOpenDialog] = useState<string | null>(null);
  const [dialogHeader, setDialogHeader] = useState('');
  const responsiveOptions = [
    {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 3
    },
    {
        breakpoint: '600px',
        numVisible: 2,
        numScroll: 2
    },
    {
        breakpoint: '480px',
        numVisible: 1,
        numScroll: 1
    }
];

const openImage = (e: any) => {
  const path = e.target.src;
  const fileName = path.split('galleryPics/');
  setDialogHeader(getImageDate(fileName[1]));
  setOpenDialog(path);
};

const getImageDate = (image: string) => {
  const imageDate = image.split('_')[0];
  const dateSplit = imageDate.split('-');
  return `${dateSplit[1]}/${dateSplit[2]}/${dateSplit[0]}`;
};

  const itemTemplate = (item: string) => {
    return <img className="item-template" src={`galleryPics/${item}`} alt="pic of collection" onClick={openImage} />;
  };

  const thumbnailTemplate = (item: string) => {
    return <img src={`galleryPics/${item}`} alt="thumb of collection" className="thumb-template" />;
  };

  useEffect(() => {
    AssetsService.getGalleryList()
      .then((list: AxiosResponse) => {
        setList(list.data);
      })  
      .catch(error => {
        console.log('gallery list error', error);
      });
  }, []);
  return (
    <div className="gallery-wrapper">
      {list && Object.keys(list as IIndexStringArr).map(key => {
        if (key && list && list[key]) {
          return (
            <Card className="galleria-card">
              <h3>{key}</h3>
              <Galleria value={list[key] as string[]} item={itemTemplate} thumbnail={thumbnailTemplate} responsiveOptions={responsiveOptions} numVisible={4} />
              <Dialog header={dialogHeader} visible={!!openDialog} onHide={() => setOpenDialog(null)} position="top" style={{height: '92vh', width: 'auto', maxWidth: '100%'}}>
                <div className="dialog-image">
                  <img src={openDialog as string} alt="" className="dialog-image--image" />
                </div>
              </Dialog>
            </Card>
          );
        } else {
          return <></>;
        }
      })}
    </div>
  );
};

export default GalleryComponent;