import RingCard from '@/components/elements/displays/RingCard'
import { NodeContext } from '@/state/admin/node'
import { formatBytes } from '@/util/helpers'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

const NodeDetailsBlock = () => {
    const node = NodeContext.useStoreState(state => state.node.data!)
    const { t } = useTranslation('admin.nodes.index')

    const memory = useMemo(() => {
        const total = formatBytes(node.memory, 2)
        const used = formatBytes(node.memoryAllocated, 2, total.unit)

        return { used, total }
    }, [node.memory])

    const disk = useMemo(() => {
        const total = formatBytes(node.disk, 2)
        const used = formatBytes(node.diskAllocated, 2, total.unit)

        return { used, total }
    }, [node.disk])

    return (
        <>
            <RingCard
                title={t('memory_allocation')}
                value={memory.used.size}
                valueLabel={memory.used.unit}
                total={memory.total.size}
                totalLabel={memory.total.unit}
            />
            <RingCard
                title={t('disk_allocation')}
                value={disk.used.size}
                valueLabel={disk.used.unit}
                total={disk.total.size}
                totalLabel={disk.total.unit}
            />
        </>
    )
}

export default NodeDetailsBlock
