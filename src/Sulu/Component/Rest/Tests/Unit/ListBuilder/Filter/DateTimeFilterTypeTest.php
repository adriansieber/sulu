<?php

/*
 * This file is part of Sulu.
 *
 * (c) Sulu GmbH
 *
 * This source file is subject to the MIT license that is bundled
 * with this source code in the file LICENSE.
 */

namespace Sulu\Component\Rest\Tests\Unit\ListBuilder\Filter;

use PHPUnit\Framework\TestCase;
use Sulu\Component\Rest\ListBuilder\FieldDescriptor;
use Sulu\Component\Rest\ListBuilder\Filter\DateTimeFilterType;
use Sulu\Component\Rest\ListBuilder\Filter\InvalidFilterTypeOptionsException;
use Sulu\Component\Rest\ListBuilder\ListBuilderInterface;

class DateTimeFilterTypeTest extends TestCase
{
    /**
     * @var DateTimeFilterType
     */
    private $dateTimeFilterType;

    /**
     * @var ListBuilderInterface
     */
    private $listBuilder;

    public function setUp(): void
    {
        $this->dateTimeFilterType = new DateTimeFilterType();
        $this->listBuilder = $this->prophesize(ListBuilderInterface::class);
    }

    public function provideFilter()
    {
        return [
            ['created', ['from' => '2020-02-05', 'to' => '2020-02-07'], ['2020-02-05', '2020-02-07']],
            ['changed', ['from' => '2013-08-01', 'to' => '2020-02-10'], ['2013-08-01', '2020-02-10']],
        ];
    }

    /**
     * @dataProvider provideFilter
     */
    public function testFilter($fieldName, $value, $expected)
    {
        $fieldDescriptor = $this->prophesize(FieldDescriptor::class);

        $this->dateTimeFilterType->filter($this->listBuilder->reveal(), $fieldDescriptor->reveal(), $value);

        $this->listBuilder->between($fieldDescriptor->reveal(), $expected)->shouldBeCalled();
    }

    public function provideFilterWithInvalidOptions()
    {
        return [
            [[]],
            [['from' => '2019-10-01']],
            [['to' => '2020-10-01']],
            ['Test'],
        ];
    }

    /**
     * @dataProvider provideFilterWithInvalidOptions
     */
    public function testFilterWithInvalidOptions($value)
    {
        $this->expectException(InvalidFilterTypeOptionsException::class);

        $fieldDescriptor = $this->prophesize(FieldDescriptor::class);
        $this->dateTimeFilterType->filter($this->listBuilder->reveal(), $fieldDescriptor->reveal(), $value);
    }
}
