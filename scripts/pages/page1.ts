import Page1Design from 'generated/pages/page1';
import PageTitleLayout from 'components/PageTitleLayout';
import System from '@smartface/native/device/system';
import { Route, Router } from '@smartface/router';
import { styleableContainerComponentMixin } from '@smartface/styling-context';
import { themeService } from 'theme';
import Screen from '@smartface/native/device/screen'
import FlexLayout from '@smartface/native/ui/flexlayout';
import FlBoardItem, { KnightType } from 'components/FlBoardItem';
import { updateUserStyle } from 'lib/action';

class StyleableFlexLayout extends styleableContainerComponentMixin(FlexLayout) { }

class StyleableFlBoardItem extends styleableContainerComponentMixin(FlBoardItem) { }

const PAGE_PADDING = 32;

export type BoardPosition = {
    x: number,
    y: number
}

type GameInfo = {
    row: number;
    col: number;
    white: BoardPosition;
    black: BoardPosition;
    turn: 'white' | 'black';
    hints: BoardPosition[];
}

export default class Page1 extends Page1Design {
    private board: StyleableFlBoardItem[][] = [];
    private disposeables: (() => void)[] = [];
    private gameInfo = {} as GameInfo;
    constructor(private router?: Router, private route?: Route) {
        super({});
        console.log('[page1] constructor');
    }

    /**
     * @event onShow
     * This event is called when a page appears on the screen (everytime).
     */
    onShow() {
        super.onShow();
        console.log('[page1] onShow');
        themeService.addGlobalComponent(this.headerBar.titleLayout, 'page1TitleLayout');
        this.headerBar.titleLayout.width = Screen.width;
        this.headerBar.titleLayout.applyLayout();
        this.disposeables.push(
        );
    }

    /**
     * @event onLoad
     * This event is called once when page is created.
     */
    onLoad() {
        super.onLoad();
        console.log('[page1] onLoad');
        this.headerBar.leftItemEnabled = false;
        this.headerBar.titleLayout = new PageTitleLayout();
        if (System.OS === System.OSType.ANDROID) {
            this.headerBar.title = '';
        }
        const row = 7;
        const col = 7;
        this.startNewGame(row, col);
        // this.moveNight({ x: 0, y: 6 }, { x: 1, y: 4 }, 'white');
    }

    isTherePosibilities(type: KnightType) {
        return this.getPosibilitiesByKnight(type).length > 0;
    }

    private playGame() {
        const poses = this.getPosibilitiesByKnight(this.gameInfo.turn);
        if (poses.length === 0) {
            if (this.gameInfo.turn === 'black') {
                if (this.isTherePosibilities('white')) {
                    alert('Congrulations, you are winner!');
                } else {
                    alert('Game over, no winner, Draw!');
                }
            } else {
                alert('Computer Won!, You are loser :(');
            }
            this.startNewGame(this.gameInfo.row, this.gameInfo.col);
            return;
        }
        console.log('Turn: ', this.gameInfo.turn, poses);
        this.drawPosibilities(poses);
        if (this.gameInfo.turn === 'black') {

            this.playComputerTurn();

        }

    }

    private isKnightPos(p: BoardPosition) {
        return this.board[p.x][p.y].isNight
    }

    private getNexPosForValidPos(p: BoardPosition) {

    }

    private moveKnightAnimation(){
        
    }

    private getBestPosForComputer() {
        const usernextPoses = this.getPosibilitiesByKnight('white');
        const computerNextPos = this.getPosibilitiesByKnight('black');
        const enemyKnightPos = computerNextPos.find(c => this.isKnightPos(c));
        if (enemyKnightPos) {
            return enemyKnightPos;
        }
        const validPos = computerNextPos.filter(c => !usernextPoses.some(u => u.x === c.x && u.y === c.y));
        let mxPosIndex = 0;
        let mxPosNum = 0;
        let validPosIndex = [0]
        validPos.map((v, index) => {
            mxPosIndex
            const poses = this.getPosibilitiesByPos(v, 'white');
            if (mxPosNum < poses.length) {
                mxPosNum = poses.length;
                mxPosIndex = index;
                validPosIndex = [index];
            } else if (mxPosNum === poses.length) {
                validPosIndex.push(index);
            }
        });
        const rndIndex = Math.floor(Math.random() * validPosIndex.length);
        return validPos[validPosIndex[rndIndex]];
    }

    private playComputerTurn() {
        const nextPos = this.getBestPosForComputer();
        if (nextPos) {
            if (this.isKnightPos(nextPos)) {
                this.lblStatus.text = 'Computer won.';
                alert('Computer Won!, You are loser :(');
                this.startNewGame(this.gameInfo.row, this.gameInfo.col);
            } else {
                this.lblStatus.text = 'Computer thinking..., be patient';
                setTimeout(() => {
                    //computer thinking...
                    this.gameInfo.hints.forEach(p => this.board[p.x][p.y].clearHint());
                    this.moveNight(this.gameInfo[this.gameInfo.turn], nextPos, this.gameInfo.turn);
                    this.turnToOtherPlayer();
                    this.playGame();
                }, 1500);
            }
        } else {
            // TODO maybe
        }
    }

    private turnToOtherPlayer() {
        this.gameInfo.turn = this.gameInfo.turn === 'white' ? 'black' : 'white';
        this.lblStatus.text = this.gameInfo.turn === 'white' ? 'Your turn.' : 'Computer turn.';
    }

    onTouchEndedBoardItem = (x: number, y: number) => {
        if (this.gameInfo.turn !== 'white') {
            console.warn('Computer turn, wait your turn');
            return true;
        }
        console.info('Playing user to ', x, ' ,  ', y, this.gameInfo[this.gameInfo.turn]);
        if (this.isPosibilityPos({ x, y })) {
            const isKnight = this.isKnightPos({ x, y });
            this.gameInfo.hints.forEach(p => this.board[p.x][p.y].clearHint());
            this.moveNight(this.gameInfo[this.gameInfo.turn], { x, y }, this.gameInfo.turn);
            if (isKnight) {
                alert('Congrulations, you are winner!');
                this.startNewGame(this.gameInfo.row, this.gameInfo.col);
            } else {
                this.turnToOtherPlayer();
                this.playGame();
            }
        } else {
            //TODO invalid touch
        }
        return true;
    }

    private startNewGame(row: number, col: number) {
        this.drawGameBoard(row, col);
        this.putKnightsStartPosition(row, col);
        this.gameInfo.row = row;
        this.gameInfo.col = col;
        this.gameInfo.turn = 'white';
        this.gameInfo.hints = [];
        setTimeout(() => this.lblStatus.text = 'Your turn.')
        this.playGame();
    }

    private isPosibilityPos(p: BoardPosition) {
        return this.gameInfo.hints.some(h => h.x === p.x && h.y === p.y);
    }

    private isInBoard(p: BoardPosition) {
        return (p.x >= 0 && p.x < this.gameInfo.row) && (p.y >= 0 && p.y < this.gameInfo.col);
    }

    private drawPosibilities(poses: BoardPosition[]) {
        this.gameInfo.hints.forEach(p => this.board[p.x][p.y].clearHint());
        poses.forEach(p => {
            this.board[p.x][p.y].drawHint();
        });
        this.gameInfo.hints = poses;
    }

    private getPosibilitiesByPos(pos: BoardPosition, enemyType: KnightType) {
        const poses: BoardPosition[] = [];
        const enemyKnightPos = this.gameInfo[enemyType];
        poses.push({ x: pos.x + 2, y: pos.y + 1 });
        poses.push({ x: pos.x + 2, y: pos.y - 1 });
        poses.push({ x: pos.x - 2, y: pos.y + 1 });
        poses.push({ x: pos.x - 2, y: pos.y - 1 });
        poses.push({ x: pos.x + 1, y: pos.y + 2 });
        poses.push({ x: pos.x + 1, y: pos.y - 2 });
        poses.push({ x: pos.x - 1, y: pos.y + 2 });
        poses.push({ x: pos.x - 1, y: pos.y - 2 });
        return poses.filter(p => {
            return this.isInBoard(p) && !this.board[p.x][p.y].isFull && !this.board[p.x][p.y].isNight
        });
    }

    private getPosibilitiesByKnight(type: GameInfo['turn']) {
        const knightPos = this.gameInfo[type];
        const poses: BoardPosition[] = [];
        poses.push({ x: knightPos.x + 2, y: knightPos.y + 1 });
        poses.push({ x: knightPos.x + 2, y: knightPos.y - 1 });
        poses.push({ x: knightPos.x - 2, y: knightPos.y + 1 });
        poses.push({ x: knightPos.x - 2, y: knightPos.y - 1 });
        poses.push({ x: knightPos.x + 1, y: knightPos.y + 2 });
        poses.push({ x: knightPos.x + 1, y: knightPos.y - 2 });
        poses.push({ x: knightPos.x - 1, y: knightPos.y + 2 });
        poses.push({ x: knightPos.x - 1, y: knightPos.y - 2 });
        return poses.filter(p => {
            return this.isInBoard(p) && !this.board[p.x][p.y].isFull
        });
    }

    private drawGameBoard(row: number, col: number) {
        const maxWidth = Screen.width - PAGE_PADDING;
        const itemSize = maxWidth / col
        console.info('Screen width: ', Screen.width, '  height:', Screen.height, {
            maxWidth,
            itemSize,
        });
        this.flBoard.removeAll();
        Array.from({ length: row }, (_, i) => i).forEach(r => {
            this.board[r] = [];
            const flRowItem = new StyleableFlexLayout();
            this.flBoard.addChild(flRowItem, `flrowitem_${r}`, '.app_board_row_item_layout');
            Array.from({ length: col }, (_, i) => i).forEach(c => {
                const flBoardItem = new StyleableFlBoardItem();
                this.board[r][c] = flBoardItem;
                flBoardItem.onTouchEnded = () => this.onTouchEndedBoardItem(r, c);
                flRowItem.addChild(flBoardItem, `flrowitem_${c}`, `.app_board_item  ${this.getBoardItemClassname(r, c)}`);
            });
            flRowItem.applyLayout();
        });
        this.flBoard.dispatch(updateUserStyle({
            height: itemSize * row
        }))
        this.flBoard.applyLayout();
        this.layout.applyLayout();
    }

    private moveNight(old: BoardPosition, newPos: BoardPosition, type: KnightType) {
        let item = this.board[old.x][old.y];
        item.addNoPlace();
        item = this.board[newPos.x][newPos.y];
        console.info('Move knight ', newPos, newPos.x, ' , ', newPos.y);
        if (!item.isFull) {
            item.clearHint();
            item.addKnight(type);
            this.gameInfo[type] = newPos;
            this.layout.applyLayout();
            return true;
        }
        return false;
    }


    private putKnightsStartPosition(row: number, col: number) {
        this.board[0][col - 1].addKnight('white');
        this.gameInfo.white = { x: 0, y: col - 1 };

        this.board[row - 1][0].addKnight('black');
        this.gameInfo.black = { x: row - 1, y: 0 };
        this.layout.applyLayout();
    }

    getBoardItemClassname(row: number, col: number) {
        return ((row + col) % 2 === 0) ? '.board_layout_1' : '.board_layout_2';
    }

    onHide(): void {
        this.dispose();
    }

    dispose(): void {
        this.disposeables.forEach((item) => item());
    }
}
