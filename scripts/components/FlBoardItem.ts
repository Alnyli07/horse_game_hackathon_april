import Color from '@smartface/native/ui/color';
import Image from '@smartface/native/ui/image';
import ImageView from '@smartface/native/ui/imageview';
import { ImageFillType, ImageViewFillTypeIOS } from '@smartface/native/ui/imageview/imageview';
import { styleableComponentMixin } from '@smartface/styling-context';
import FlBoardItemDesign from 'generated/my-components/FlBoardItem';
import { pushClassNames, removeClassName, updateUserStyle } from 'lib/action';

class StyleableImageView extends styleableComponentMixin(ImageView) { } // For a View, styleableComponentMixin is used.

export type KnightType = 'white' | 'black';

export const KNIGHT_IMAGES = {
    'white': 'chess_white.png',
    'black': 'chess_black.png'
}
export default class FlBoardItem extends FlBoardItemDesign {
    pageName?: string | undefined;
    imageView?: StyleableImageView;
    isFull: boolean = false;
    isNight: boolean = false;
    constructor(props?: any, pageName?: string) {
        // Initalizes super class for this scope
        super(props);
        this.pageName = pageName;
    }

    addKnight(type: KnightType = 'black') {
        if (this.imageView) {
            this.imageView.dispatch(updateUserStyle({ image: KNIGHT_IMAGES[type] }));
            return;
        }
        this.imageView = new StyleableImageView();
        this.addChild(this.imageView, 'knight_imageview',
            '.app_board_item_image', {
            image: KNIGHT_IMAGES[type],
            imageFillType: 'ASPECTFIT'
        });
        this.imageView.imageFillType = ImageFillType.STRETCH;
        this.applyLayout();
        this.isNight = true;
    }

    drawHint() {
        this.borderWidth = 2;
        this.dispatch(pushClassNames(['.app_board_item_hint']));
    }

    clearHint() {
        this.borderWidth = 0;
        this.dispatch(removeClassName('.app_board_item_hint'));
    }

    getComputerBestPosition() {

    }

    addNoPlace() {
        if (this.imageView) {
            console.log('Knight img. pos > ', this.imageView.left, ' , ', this.imageView.top, this.imageView.getScreenLocation())
            this.imageView.dispatch(updateUserStyle({ image: 'no_place.png' }));
        } else {
            this.imageView = new StyleableImageView();
            this.addChild(this.imageView, 'knight_imageview',
                '.app_board_item_image', {
                image: 'no_place.png',
                imageFillType: 'ASPECTFIT'
            });
            this.imageView.imageFillType = ImageFillType.STRETCH;
            this.applyLayout();
        }
        this.isFull = true;
    }
}
