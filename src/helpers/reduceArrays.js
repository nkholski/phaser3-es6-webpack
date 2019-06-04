export default (a, kn, vn) => a.reduce((r, i) => {
    r[i[kn]] = i[vn];
    return r;
}, {});
