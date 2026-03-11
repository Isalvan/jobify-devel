<?php

namespace Tests\Unit;

use App\Support\QueryHelper;
use PHPUnit\Framework\TestCase;

class QueryHelperTest extends TestCase
{
    public function test_escape_like_escapes_special_characters()
    {
        $this->assertEquals('100\\%', QueryHelper::escapeLike('100%'));
        $this->assertEquals('user\\_name', QueryHelper::escapeLike('user_name'));
        $this->assertEquals('back\\\\slash', QueryHelper::escapeLike('back\\slash'));
        $this->assertEquals('mixed\\%\\_\\\\', QueryHelper::escapeLike('mixed%_\\'));
    }

    public function test_escape_like_does_not_affect_normal_characters()
    {
        $this->assertEquals('normal text', QueryHelper::escapeLike('normal text'));
        $this->assertEquals('12345', QueryHelper::escapeLike('12345'));
    }
}
