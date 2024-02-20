const { Member, Profile } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

//회원가입
exports.signup = async (req, res) => {
    const { userId, pw, username, age, email } = req.body;
    //존재여부확인
    const find = await Member.findOne({ where: { userId } });
    console.log('find', find);

    if (find) {
        res.json({ success: false, message: '이미존재하는 회원' });
    } else {
        const password = await bcrypt.hash(String(pw), 11);
        //생성 create
        const result = await Member.create({ userId, password });
        console.log('signup', result);
        const result2 = await Profile.create({ username, age, email, memberId: result.id });
        console.log('profile', result2);
        res.json({ success: true });
    }
};
//로그인
exports.login = async (req, res) => {
    const { userId, pw } = req.body;

    //검색 findOne
    const result = await Member.findOne({ where: { userId } });

    console.log('login', result);
    if (result) {
        const password = await bcrypt.compare(pw, result.password);
        if (password) {
            //jwt토큰 발행 //회원아이디 비밀번호 담는거아니다. UUID나 ID등을 담는 것이다
            const token = jwt.sign({ id: result.id }, process.env.SECRET, { expiresIn: '1h' });
            //유효시간이 되면 새로운 토큰 재발행 등
            res.json({ success: true, result, token });
        } else {
            res.json({ success: false, message: '비밀번호가 틀립니다' });
        }
    } else {
        res.json({ success: false });
    }
};
//회원조회
exports.find = async (req, res) => {
    const { id } = req.user; //auth 미들웨어에서 보내주는 값
    console.log('req.user', req.user);
    const result = await Member.findByPk(id, {
        attributes: ['userId', 'password'],
        include: [{ model: Profile, attributes: ['username', 'age', 'email'] }],
    });
    console.log('result', result);
    res.json({ success: true, result });
};
//정보수정
exports.update = async (req, res) => {
    const { id } = req.user;
    const { pw, age, username, email } = req.body;
    const result = await Member.update({ password: pw }, { where: { id } });
    const result2 = await Profile.update({ username, age, email }, { where: { id } });
    console.log('update', result);
    res.json({ success: true });
};
//회원탈퇴
exports.delete = async (req, res) => {
    const { id } = req.user;
    const result = await Member.destroy({ where: { id } });
    console.log('delete', result);
    res.json({ success: true });
};
