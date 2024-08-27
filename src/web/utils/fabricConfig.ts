import { fabric } from 'fabric';

// Fabric.jsのオブジェクトにカスタムプロパティを追加して保存するための設定
fabric.Object.prototype.toObject = (function(toObject) {
  return function(this: fabric.Object) {
    const object = toObject.call(this);
    return fabric.util.object.extend(object, {
      cornerSize: this.cornerSize,
      cornerStrokeColor: this.cornerStrokeColor,
      strokeUniform: this.strokeUniform,
      lockRotation: this.lockRotation,
      lockMovementX: this.lockMovementX,
      lockMovementY: this.lockMovementY,
      hasControls: this.hasControls,
      selectable: this.selectable,
      evented: this.evented,
      hasBorders: this.hasBorders,
      row: this.row,         // カスタムプロパティ 'row'
      col: this.col,        // カスタムプロパティ 'col'
      label: this.label,    // カスタムプロパティ 'label'
      edgeType: this.edgeType // カスタムプロパティ 'edgeType'
    });
  };
})(fabric.Object.prototype.toObject);
