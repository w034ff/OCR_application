import { fabric } from 'fabric';

// Fabric.jsのオブジェクトにカスタムプロパティを追加して保存するための設定
fabric.Object.prototype.toObject = (function(toObject) {
  return function(this: fabric.Object) {
    const object = toObject.call(this);

    // デフォルトのコントロール設定 (mtr等をfalseに設定)
    this.setControlsVisibility({
      mtr: false,  // 回転ハンドルを非表示
    });
    
    // オブジェクトにカスタムプロパティを追加
    return fabric.util.object.extend(object, {
      cornerSize: this.cornerSize,
      cornerStrokeColor: this.cornerStrokeColor,
      strokeUniform: this.strokeUniform,
      lockRotation: this.lockRotation,
      lockMovementX: this.lockMovementX,
      lockMovementY: this.lockMovementY,
      lockScalingX: this.lockScalingX,
      lockScalingY: this.lockScalingY,
      hasControls: this.hasControls,
      selectable: this.selectable,
      evented: this.evented,
      hasBorders: this.hasBorders,
      row: this.row,         // カスタムプロパティ 'row'
      col: this.col,        // カスタムプロパティ 'col'
      label: this.label,    // カスタムプロパティ 'label'
      edgeType: this.edgeType, // カスタムプロパティ 'edgeType'
      isBackground: this.isBackground // カスタムプロパティ 'isBackground'
    });
  };
})(fabric.Object.prototype.toObject);

// Lineオブジェクトのデフォルトのコントロールポイントを設定する
fabric.Line.prototype.toObject = (function(toObject) {
  return function(this: fabric.Line) {
    const line = toObject.call(this);

    // デフォルトのコントロール設定 (mtr等をfalseに設定)
    this.setControlsVisibility({
      tl: false,   // 左上のスケーリングコントロールを非表示
      tr: false,   // 右上のスケーリングコントロールを非表示
      bl: false,   // 左下のスケーリングコントロールを非表示
      br: false,   // 右下のスケーリングコントロールを非表示
      mt: this.lockMovementY,  // 上辺のスケーリング (lockMovementYに基づく)
      mb: this.lockMovementY,  // 下辺のスケーリング (lockMovementYに基づく)
      ml: this.lockMovementX,  // 左辺のスケーリング (lockMovementXに基づく)
      mr: this.lockMovementX   // 右辺のスケーリング (lockMovementXに基づく)
    });

    return line;
  };
})(fabric.Line.prototype.toObject);
