/* 赛道评分引擎：与 score.py 同族的 JS 镜像思路，纯函数、可复算。
 * 输入：每赛道 5 维评分（1-5）与权重（0-100），输出加权总分与梯队。 */
var Engine = (function () {
"use strict";
function weightedScore(dims, weights) {
  var sum = 0, wsum = 0;
  Object.keys(weights).forEach(function (k) {
    var w = Number(weights[k]) || 0;
    wsum += w;
    sum += (Number(dims[k]) || 0) * w;
  });
  return wsum ? sum / wsum : 0;
}
function computeAll(sectors, weights) {
  return sectors.map(function (s) {
    return { id: s.id, name: s.name, dims: s.dims, note: s.note, conf: s.conf, total: weightedScore(s.dims, weights) };
  }).sort(function (a, b) { return b.total - a.total; });
}
function band(v) { return v >= 4 ? '第一梯队' : v >= 3 ? '第二梯队' : v >= 2 ? '观察' : '低优先'; }
return { weightedScore: weightedScore, computeAll: computeAll, band: band };
})();
