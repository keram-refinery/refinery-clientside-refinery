/*global refinery, expect, describe, it, before, after */
/* jshint -W024 */
/* jshint expr: true, unused: true */

(function () {
    'use strict';

    var n = new refinery.ObjectState();

    describe('refinery.ObjectState', function () {
        describe('empty', function () {
            it('have none states', function () {
                expect(n.states).to.be.empty;
            });

            it('have property initialisable', function () {
                expect(n).to.have.property('_initialisable');
            });

            it('is initialisable', function () {
                expect(n.is('initialisable')).to.be.true;
            });
        });

        describe('passing default states', function () {
            before(function () {
                n = new refinery.ObjectState({
                    'closed' : true,
                    'opened' : false
                });
            });

            after(function () { });

            it('returns correct states', function () {
                expect(n.is('closed')).to.be.true;
                expect(n.is('opened')).to.be.false;
                expect(n.is('initialising')).to.be.false;
                expect(n.is('initialised')).to.be.false;
            });
        });

        describe('tests', function () {
            before(function () {
                n = new refinery.ObjectState({
                    'closed' : true,
                    'opened' : false
                });
                n._openable = function () {
                    return (this.is('initialised') && this.get('closed') &&
                        !this.get('opened') && !this.get('opening'));
                };
                n._closable = function () {
                    return (!!this.get('opened') && !this.get('closed') && !this.get('closing'));
                };
            });


            it('have properties _initialisable, _openable and _closable', function () {
                expect(n).to.have.property('_initialisable');
                expect(n).to.have.property('_openable');
                expect(n).to.have.property('_closable');
            });

            it('is initialisable', function () {
                expect(n.is('initialisable')).to.be.true;
            });

            it('is openable', function () {
                expect(n.is('openable')).to.be.false;
            });

            it('is not closable', function () {
                expect(n.is('closable')).to.be.false;
            });

            describe('initialised', function () {

                before(function () {
                    n.set('initialised', true);
                });

                after(function () {
                    n.set('initialised', false);
                });

                it('is not initialisable', function () {
                    expect(n.is('initialisable')).to.be.false;
                });

                it('is openable', function () {
                    expect(n.is('openable')).to.be.true;
                });

                it('is not closable', function () {
                    expect(n.is('closable')).to.be.false;
                });

                describe('opened with sets', function () {
                    before(function () {
                        n.set({'opened': true, 'closed': false});
                    });

                    after(function () {
                        n.set({'opened': false, 'closed': true});
                    });

                    it('is not initialisable', function () {
                        expect(n.is('initialisable')).to.be.false;
                    });

                    it('is not openable', function () {
                        expect(n.is('openable')).to.be.false;
                    });

                    it('is closable', function () {
                        expect(n.is('closable')).to.be.true;
                    });
                });

                describe('opened with toggle', function () {
                    before(function () {
                        n.set({'opened': false, 'closed': true});
                        n.toggle('opened', 'closed');
                    });

                    it('is not initialisable', function () {
                        expect(n.is('initialisable')).to.be.false;
                    });

                    it('is not openable', function () {
                        expect(n.is('openable')).to.be.false;
                    });

                    it('is closable', function () {
                        expect(n.is('closed')).to.be.false;
                        expect(n.is('closable')).to.be.true;
                    });
                });

            });
        });
    });

}());
