/*global refinery, expect, describe, it, before, after */
/* jshint -W024 */
/* jshint expr: true, unused: true */

(function () {
    'use strict';

    var obj, subobj, subobj2, subobj3;

    var CustomState = function (states) {
        states = states || {};
        this.states = $.extend(states, this.states);
    };

    CustomState.prototype = refinery.ObjectState.prototype;

    CustomState.prototype.states = {'closed' : true};
    CustomState.prototype._openable = function () {
        return (this.get('initialised') && this.get('closed') && !this.get('opening'));
    };

    CustomState.prototype._closable = function () {
        return (!this.get('closing') && this.get('opened'));
    };

    refinery.Object.create({
        'name': 'TestClass',
        State: CustomState
    });

    refinery.Object.create({
        'name': 'TestSubClass',
        objectPrototype: new refinery.TestClass()
    });

    describe('refinery.Object', function () {

        before(function () {
            obj = new refinery.Object();
        });

        after(function () {
            obj = null;
        });

        it('is instance of refinery.Object', function () {
            expect(obj).to.be.an.instanceof(refinery.Object);
        });

        it('is registered in refinery.Object instances', function () {
            expect(refinery.Object.instances.get(obj.uid)).to.be.eql(obj);
        });

        describe('properties', function () {
            it('should have properties, id, name, module, version, uid, fullname', function () {
                expect(obj).to.have.property('id');
                expect(obj).to.have.property('name', 'Object');
                expect(obj).to.have.property('module', 'refinery');
                expect(obj).to.have.property('version');
                expect(obj).to.have.property('uid', obj.name + obj.id);
                expect(obj).to.have.property('fullname', obj.module + '.' + obj.name);
            });
        });

        describe('states', function () {
            it('is initialisable', function () {
                expect(obj.is('initialisable')).to.be.true;
            });

            it('is not openable', function () {
                expect(obj.is('openable')).to.be.false;
            });

            describe('initialised', function () {
                before(function () {
                    obj.init($('<div/>'));
                });

                it('is initialised', function () {
                    expect(obj.is('initialised')).to.be.true;
                });

                it('is not initialisable', function () {
                    expect(obj.is('initialisable')).to.be.false;
                });
            });
        });

    });


    describe('refinery.Object subclass', function () {

        before(function () {
            subobj = new refinery.TestClass();
        });

        it('is instance of refinery.Object', function () {
            expect(subobj).to.be.an.instanceof(refinery.Object);
        });

        it('is registered in refinery.Object instances', function () {
            expect(refinery.Object.instances.get(subobj.uid)).to.be.eql(subobj);
        });

        describe('states', function () {

            before(function () {
                subobj.state.set('initialised', false);
                subobj.state.set('initialising', false);
            });

            it('is initialisable', function () {
                expect(subobj.is('initialisable')).to.be.true;
            });

            it('is not openable', function () {
                expect(subobj.is('openable')).to.be.false;
            });

            describe('initialised', function () {

                before(function () {
                    subobj.init($('<div/>'));
                });

                it('is initialised', function () {
                    expect(subobj.is('initialised')).to.be.true;
                });

                it('is not initialisable', function () {
                    expect(subobj.is('initialisable')).to.be.false;
                });
            });

        });
    });




    describe('refinery.TestClass subclass', function () {

        before(function () {
            subobj = new refinery.TestClass();

            subobj2 = new refinery.TestSubClass();
            subobj3 = new refinery.TestSubClass();
        });

        it('is instance of refinery.Object', function () {
            expect(subobj2).to.be.an.instanceof(refinery.Object);
        });

        it('is instance of refinery.TestClass', function () {
            expect(subobj2).to.be.an.instanceof(refinery.TestClass);
        });

        it('is registered in refinery.Object instances', function () {
            expect(refinery.Object.instances.get(subobj.uid)).to.be.eql(subobj);
        });


        it('is initialisable', function () {
            expect(subobj.is('initialisable')).to.be.true;
            expect(subobj2.is('initialisable')).to.be.true;
        });

        it('is not openable', function () {
            expect(subobj.is('openable')).to.be.false;
            expect(subobj2.is('openable')).to.be.false;
        });

        describe('states', function () {

            before(function () {
                subobj.state.set('initialised', true);
                subobj.state.set('initialising', false);
            });

            it('is initialisable', function () {
                expect(subobj.is('initialisable')).to.be.false;
                expect(subobj2.is('initialisable')).to.be.true;
            });

            describe('initialised', function () {

                before(function () {
                    subobj2.state.set('initialised', true);
                    subobj2.state.set('initialising', false);
                });

                it('is not initialisable', function () {
                    expect(subobj2.is('initialisable')).to.be.false;
                    expect(subobj3.is('initialisable')).to.be.true;
                });

                it('is openable', function () {
                    expect(subobj2.is('openable')).to.be.true;
                    expect(subobj3.is('openable')).to.be.false;
                });

                it('is not closable', function () {
                    expect(subobj2.is('closable')).to.be.false;
                    expect(subobj3.is('closable')).to.be.false;
                });

            });

            describe('opening', function () {

                before(function () {
                    subobj2.state.set('opening', true);
                });

                after(function () {
                    subobj2.state.set('opening', false);
                });

                it('is not openable', function () {
                    expect(subobj2.is('openable')).to.be.false;
                    expect(subobj3.is('openable')).to.be.false;
                });

                it('is not opened', function () {
                    expect(subobj2.is('opened')).to.be.false;
                    expect(subobj3.is('openable')).to.be.false;
                });

                it('is not closable', function () {
                    expect(subobj2.is('closable')).to.be.false;
                    expect(subobj3.is('closable')).to.be.false;
                });

                describe('opened', function () {

                    before(function () {
                        // ensure we have correct states
                        subobj2.state.set('opening', true);
                        subobj2.state.set('opened', false);
                        subobj2.state.set('closed', true);
                        subobj2.state.toggle('opening', 'opened', 'closed');
                    });

                    after(function () {
                        subobj2.state.toggle('opening', 'opened', 'closed');
                    });

                    it('is not openable', function () {
                        expect(subobj2.is('openable')).to.be.false;
                        expect(subobj3.is('openable')).to.be.false;
                    });

                    it('is opened', function () {
                        expect(subobj2.is('opening')).to.be.false;
                        expect(subobj2.is('opened')).to.be.true;
                    });

                    it('is closable', function () {
                        expect(subobj2.is('closable')).to.be.true;
                        expect(subobj3.is('closable')).to.be.false;
                    });
                });
            });
        });
    });

}());
